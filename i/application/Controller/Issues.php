<?php

class Controller_Issues extends Controller{
	public function __construct(){
		parent::__bind();
	}
	public function get($issue_no = false){
		//echo SITE_PATH . '\i\templates';
		$directory = SITE_PATH . '/i/application/templates/issues';
		$scanned_directory = array_diff(scandir($directory), array('..', '.'));
		
		$scanned_directory = array_values(array_map(function($filename){
			return preg_replace('/\\.[^.\\s]{3,4}$/', '', $filename);
		}, $scanned_directory));
		$key = array_search("list", $scanned_directory);
		unset($scanned_directory[$key]);
		if(!$issue_no){
			$this->template = $this->Mustache->loadTemplate("/issues/list");
			IO::Stream($this->template->render(['issues' => $scanned_directory]));
		}else{
			try {
				$this->template = $this->Mustache->loadTemplate("/issues/" . $issue_no);
				IO::Stream($this->template->render());
			} catch(Exception $e) { echo "Template for issue does not exist"; }
		}
	}
	public function post(){
		sleep(5);
		print_fr($_REQUEST);
	}
}




?>