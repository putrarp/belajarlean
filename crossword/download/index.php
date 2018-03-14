<?php
define('PDF_LIBRARY', 'FPDF');
require "include/config.php";
require "include/utils.php";

/**
 * Edit this function to restrict the access to the download feature
 * @return [Boolean] Whether the user can download the pdf
 */
function user_can_download_pdf() {
    return false;
}

if (!user_can_download_pdf() || !($data = validate_data())):
    $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : "..";
    die("Oops, you can't download this puzzle. <a href='$referer'>but you can still playing</a>");
endif;

require "include/Soup.php";

$pdf = new PDFSoup($data);

$pdf->download("{$data->title}");
