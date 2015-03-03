<?php

class Controller_Builder extends Controller{

	public function post(){
		
		$builder = new Domain_Builder();

		$b = $this->Mustache->loadTemplate("/builder/success");

		echo $b->render([
			"stepheader__title" => "Build static environment",
			"stepheader__current" => "2",
			"stepheader__total" => "2",
			"stepheader__subtitle" => "Success",
			"info__title" => "Build successful",
			"info__copy" => "There will be more information later"
		]);
		if(isset($_POST['dirs'])){
			$controllers = $builder->getAvailableControllers($_POST['dirs']);
			foreach($controllers as $controller){
				$builder->saveStaticController($controller);
			}
		}
		echo '<br/><br/><a class="newcta" href="/builder">Build another</a>';
		$h = $this->Mustache->loadTemplate("/builder/footer");
		echo $h->render([]);
	}

	public function get(){

		$builder = new Domain_Builder();

		$h = $this->Mustache->loadTemplate("/builder/index");

		echo $h->render([
			"stepheader__title" => "Build static environment",
			"stepheader__current" => "1",
			"stepheader__total" => "2",
			"stepheader__subtitle" => "Project Overview",

			"structure" => $builder->getAvailableControllers(),
		]);


		//$this->saveStaticController($controllers);
		if(isset($_POST['dirs'])){
			$controllers = $builder->getAvailableControllers($_POST['dirs']);
			foreach($controllers as $controller){
				$builder->saveStaticController($controller);
			}
		}


		// $this->saveStaticControllerMethod(
		// 	"Pattern",
		// 	"patterns",
		// 	"patterns", 
		// 	false,
		// 	"index"
		// );
		/* "Pattern", "patterns", "index", "patterns" */
		/*
			$test = new ReflectionClass('TestClass');
			//$doc = $test->getMethod("node_delete")->getDocComment();
			$all = [];
			foreach($test->getMethods() as $meth){

				$matches = [];
				$match = preg_match("/\* @([A-Za-z]+) (hook_)?([A-Za-z_]+)/", $meth->getDocComment(), $matches);
				$all[] = $matches;
			}

			?>
			<?php foreach($all as $m): ?>
			<ul>
				<li><b>Method:</b> <?php print $m[1];?></li>
				<li><b>Hook:</b> <?php print $m[2];?><?php print $m[3];?></li>
			</ul>
			<?php endforeach; ?>

		 */
	}





}