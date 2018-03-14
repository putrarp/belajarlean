<?php if (!defined('BASE_PATH')) die("No direct access allowed");

// Puzzle to edit
$id = $_GET["edit"];

if ($_POST)
{
    $name = $_POST["puzzle-name"];
    $data = $_POST["clues"];
    
    if ($name) {
        $puzzle = new Puzzle;
        $id = $puzzle->save($name, $data);
        redirect("?edit=$id&success");
    }
}
else if ($id)
{
    $puzzle = new Puzzle;
    
    if ($result = $puzzle->get($id))
    {
        $data = $result["data"];
        $name = $result["name"];
    }
}
