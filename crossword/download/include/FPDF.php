<?php
require("fpdf/fpdf.php");

class PDF extends FPDF {
    function __construct($orientation="P", $unit="pt", $size="letter")
    {
        parent::__construct($orientation, $unit, $size);
        $this->SetFont('Arial', '', 12.5);
    }

    public function getPageWidth() {
        return $this->w;
    }

    public function getPageHeight() {
        return $this->h;
    }

    public function getMarginLeft() {
        return $this->lMargin;
    }

    public function getMarginRight() {
        return $this->rMargin;
    }

    public function getFontSize() {
        return $this->FontSizePt;
    }

    function footer() {
        global $config;
        $this->setY(30);
        // Select Arial bold 15
        $this->SetFont('Arial','I',12);
        // Move to the right
        $this->Cell(0,10,utf8_decode($config["header"]),0,0,'C');
        // Line break
        $this->Ln(20);
    }
}
