<?php

class Controller_ExampleEmails extends Controller_FilesystemBase {

	public function __construct(){
		parent::__construct("emails", [
			"path" => "emails",
			"header" => false,
			"footer" => false
		]);
	}


}

?>