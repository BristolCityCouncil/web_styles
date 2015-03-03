<?php

class Controller_Pages extends Controller_FilesystemBase{

	public function __construct(){
		parent::__construct("pages", [
			"path" => "pages",
			"header" => "chrome/header.v2",
			"footer" => "chrome/footer.v2"
		]);
	}


}

?>