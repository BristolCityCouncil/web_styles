<?php

class Controller_Hogan extends Controller {

	public function __construct(){
		parent::__bind();
	}

	public function get() {
		
		$h = $this->Mustache->loadTemplate("/chrome/header");
		echo $h->render([]);

		echo file_get_contents("hogan.html");

	}


}


?>