<?php

class Controller_CustomPatterns extends Controller_FilesystemBase {

	/**
	 * @path custom/patterns
	 * @folder patterns-custom
	 */
	public function __construct(){
		parent::__construct("patterns-custom", [
			"path" => "custom/patterns/",
			"header" => "chrome/custom-header",
			"footer" => "chrome/custom-footer"
		]);
	}



}

?>