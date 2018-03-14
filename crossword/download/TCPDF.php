<?php
require("tcpdf/tcpdf.php");

class PDF extends TCPDF {
    function __construct($orientation="P", $unit="pt", $size="letter")
    {
        parent::__construct($orientation, $unit, $size);
        $this->SetFont('freesans', '', 13);
    }

    public function getMarginLeft() {
        $margins = $this->getMargins();
        return $margins['left'];
    }

    public function getMarginRight() {
        $margins = $this->getMargins();
        return $margins['right'];
    }
}