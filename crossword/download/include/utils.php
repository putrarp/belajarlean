<?php
function validate_data() {
    if (isset($_POST["data"]))
        $data = json_decode($_POST["data"]);
    else if (isset($_GET["data"]))
        $data = json_decode(urldecode($_GET["data"]));
    else
        return false;

    //echo "<pre>";print_r(($data));die;

    if (! isset($data->title) || !isset($data->board) || !isset($data->clues))
        return false;

    if (!is_array($data->board) || !is_object($data->clues) || !is_string($data->title))
        return false;

    foreach ($data->board as $row => $col) {
        foreach ($col as $cell) {
            if ($cell && !isset($cell->char))
                return false;
        }
    }

    foreach ($data->clues as $index => $clue) {
        if (!preg_match("/^\d+,\d+,\d+$/", $index) || !is_string($clue))
            return false;
    }

    return $data;
}