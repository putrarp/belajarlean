<?php if (!defined('BASE_PATH')) die("No direct access allowed");

include_once("config.php");

class Puzzle {
    
    # Save words to a file
    function save($name, $data)
    {
        $data = "#title: $name\n$data";
        if (file_put_contents($this->getFilePath($name), trim($data)))
            $this->deleteFileIfNeeded($name);

        return $this->getFileName($name);
    }

    private function deleteFileIfNeeded($name) {
        // filename is different
        if (! empty($_GET['edit']) && $_GET['edit'] !== $this->getFileName($name))
            unlink($this->getFilePath($_GET['edit']));
    }

    // Get Words from file
    function get($name)
    {
        $filename = $this->getFilePath($name);
        $name = $this->getPuzzleName($name);
        
        $data = array();
        $options = array();

        if ($content = file_get_contents($filename))
        {
            $lines = preg_split("/\r\n|\n/", $content);

            $data['clues'] = '';
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line[0] !== "#")
                    $data['clues'] .= "$line\n";
            }
        }

        return array("name" => $name, "data" => $data);
    }
    
    // Get list of files
    function getAll($page=0)
    {
        global $config;

        $files = glob(PATH."/*.txt");

        $start = ($page - 1) * $config->per_page;
        $end   = $page * $config->per_page;
        $data  = array();

        for ($i = $start; $i < $end;  $i += 1)
        {

            if (!isset($files[$i])) { break; }

            # remove file extention
            $name = str_replace(".txt", "", str_replace(PATH."/", "", $files[$i]));

            $data[] =  (object)array(
                "name" => $this->getPuzzleName($name),
                "id"   => $name
            );
        }

        return $data;
    }

    // Count all files
    function countAll()
    {
        return count(glob(PATH."/*.txt"));
    }

    // remove dash from file name
    function getPuzzleName($name)
    {
        return str_replace("-", " ", ucwords($name));
    }
    
    // Get file location
    function getFilePath($name)
    {
        $filename = $this->getFileName($name);
        
        return PATH."/$filename.txt";
    }
    
    function getFileName($name)
    {
        return str_replace(" ", "-", strtolower($name));
    }
}
