<?php

class Controller_CustomPages extends Controller_FilesystemBase{

    /**
     * @title       Custom pages
     * @description This is our custom pages created using the components. It is an example of how to extend the Pattern Lib.
     * @path        custom/pages
     * @folder      pages
     */
    public function __construct(){
        parent::__construct("pages", [
            "path" => "pages",
            "header" => false,
            "footer" => false
        ]);
    }


}

?>