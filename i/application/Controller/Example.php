<?php

class Controller_Example extends Controller_FilesystemBase {

	public function __construct(){
		parent::__construct("example", [
			"path" => "pages/",
			"header" => "chrome/header.v2",
			"footer" => "chrome/footer.v2"
		]);
	}


}

?>