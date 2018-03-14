<?php

require(PDF_LIBRARY.".php");

define("LIST_NUMBER_WIDTH", 20);

class PDFSoup {
    private $title_size_ratio = 2;
    private $cell_ratio = 1.2;

    public function __construct($data)
    {
        global $config;
        $this->pdf  = new PDF('P', 'pt', $config['page_size']);
        $this->data = $data;
        $this->start_y = $this->pdf->GetY();
    }
    
    private function centerText($text) {
        $this->writeText($text, "C");
    }

    private function writeText($text, $align) {
        $this->pdf->MultiCell(0, $this->lineHeight,
                                 $this->iconv($text), 0, $align);
    }

    private function createPDF() {
        $this->lineHeight = $this->pdf->getFontSize() * 1.5;

        $this->pdf->setTopMargin(70);
        $this->pdf->AddPage();
        $this->writeTitle();
        $this->writeBoard();

        $this->pdf->AddPage();
        $this->writeSolution();
    }

    public function download($name) {
        $this->createPDF();
        $this->pdf->Output("$name.pdf", "I");
    }

    private function writeSolution() {
        $this->pdf->SetFont('', '', 10);
        $this->writeTitle("SOLUTION");
        $this->createBoard(True);
    }

    private function get($name) {
        return isset($this->data->$name) ? $this->data->$name : "";
    }

    private function iconv($text) {
        $text = (string)$text;
        return PDF_LIBRARY === "TCPDF" ? $text : utf8_decode($text);
    }

    private function getCellSize() {
        return $this->pdf->getFontSize() * $this->cell_ratio;
    }

    public function writeTitle($title=Null) {
        $old_font_size = $this->pdf->getFontSize();
        $this->pdf->setFontSize($old_font_size * $this->title_size_ratio);
        $this->centerText($title ? $title : $this->get("title"));
        $this->pdf->setFontSize($old_font_size);
        $this->pdf->Ln(20); 
    }
        
    private function writeBoard() {
        $this->pdf->Ln();
        $this->createBoard();
        $this->pdf->SetFont('', '');
        $this->pdf->Ln(20);
        $pdf = $this->pdf;

        $this->clueWidth = ($pdf->getPageWidth() - $pdf->getMarginLeft()*2-50) / 2;
        $pdf->setFontSize(11);

        $pdf->setFont("", "B");

        $this->pdf->Cell($this->clueWidth, $this->lineHeight,
                            $this->iconv("ACROSS"), 0, 0, "C");

        $this->pdf->Cell($this->clueWidth, $this->lineHeight,
                            $this->iconv("DOWN"), 0, 0, "C");

        $this->pdf->ln(20);

        $startY = $pdf->getY();

        $lastDownY   = $pdf->getY();
        $lastAcrossY = $pdf->getY();

        while ($this->across || $this->down) {
            $across = array_shift($this->across);
            $down   = array_shift($this->down);

            if ($across) {
                $pdf->setY($lastAcrossY);
                $this->writeClue($across);
                $lastAcrossY = $pdf->getY();
            }

            if ($down)   {
                $pdf->setY($lastDownY);
                $pdf->setX($this->clueWidth + 60);
                $this->writeClue($down);
                $lastDownY = $pdf->getY();
            }
        }

        $x = $this->clueWidth + LIST_NUMBER_WIDTH * 2;
        $pdf->line($x+10, $startY, $x+10, max($lastDownY, $lastAcrossY));
    }

    private function writeClue($clue) {
        // clue number in bold
        $this->pdf->setFont("", "B");
        $this->pdf->Cell(LIST_NUMBER_WIDTH, $this->lineHeight, $clue["index"], 0, 0, "R");

        $this->pdf->setFont("", "");
        $this->pdf->Multicell($this->clueWidth, $this->lineHeight,
                              $this->iconv($clue["clue"]), 0, "L");
    }

    private function createBoard($is_solution=False) {
        $cs    = $this->getCellSize();
        $pdf   = $this->pdf;
        $grid  = $this->get("board");
        $clues = (array)$this->get("clues");
        $len  = count($grid);
        $boardWidth = $cs * (count($grid[0])+2);
        $offsetx    = ($pdf->getPageWidth()-$boardWidth)/2;
        $offsety    = $pdf->getY();
        $clue_counter = 0;

        $pdf->setFillColor(240, 240, 240);
        $pdf->rect($offsetx-$cs, $offsety-$cs,
                   $boardWidth,
                   $cs * ($len+2), "F");

        if (! $is_solution)
            $pdf->setFontSize(6);

        $pdf->SetLineWidth(1);
        $pdf->SetDrawColor(0, 0, 0);
        $pdf->SetFillColor(255, 255, 255);
        $this->across = array();
        $this->down   = array();


        for ($i = 0; $i < $len; $i++)
        {
            $this->pdf->setX($offsetx);
            for ($j = 0; $j < count($grid[$i]); $j++)
            {
                $x = $j * $cs + $offsetx;
                $y = $i * $cs + $offsety;
                $cell = $grid[$i][$j];

                $char = $is_solution && $cell ? $cell->char : "";

                $pdf->Cell($cs, $cs, $this->iconv(strtoupper($char)), 
                         (bool)$cell, 0, "C", (bool)$cell);
                
                // No dibujar numeros en la solución
                if (! $cell || $is_solution) { continue; }

                // si se dibuja un rectangulo, éste cubrira la solución
                $index1 = $j.",".$i.",1";
                $index2 = $j.",".$i.",0";

                if (isset($clues[$index1]) || isset($clues[$index2]) ) {
                    $clue_counter++;
                    $pdf->Text($x+2, $y+7, $this->iconv($clue_counter));

                    if (isset($clues[$index2])) {
                        $this->across[] = array(
                            "clue"  => $clues[$index2],
                            "index" => "$clue_counter)"
                        );
                    }

                    if (isset($clues[$index1])) {
                        $this->down[] = array(
                            "clue"  => $clues[$index1], 
                            "index" => "$clue_counter)"
                        );
                    }
                }
            }

            $this->pdf->Ln();
        }

        $this->pdf->Ln();
    }
}
