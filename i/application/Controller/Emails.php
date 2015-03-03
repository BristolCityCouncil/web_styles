<?php

class Controller_Emails extends Controller_FilesystemBase {

	/**
	 * @path example/emails
	 * @folder emails
	 */
	public function __construct(){
		parent::__construct("emails", [
			'path' => "emails/",
			"header" => false,
			"footer" => false
		]);
	}

}

?>