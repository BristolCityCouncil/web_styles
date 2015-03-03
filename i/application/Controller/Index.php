<?php

class Controller_Index extends Controller {
	public function __construct(){
		parent::__bind();
	}
	public function get(){

		echo (new View_Index())->render();

	}
}

class View_Index extends View {

	public function __construct(){
		parent::__construct();
	}

}



?>