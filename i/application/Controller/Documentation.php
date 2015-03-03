<?php

class Controller_Documentation extends Controller_FilesystemBase {

	/**
	 * @path documentation
	 * @folder documentation
	 */
	public function __construct(){
		parent::__construct("documentation", [
			'path' => "documentation/",
			"header" => "chrome/header",
			"footer" => "chrome/footer"
		]);
	}

}

?>