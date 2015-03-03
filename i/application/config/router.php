 <?php

Router::serve(array(


	"workspace(/:alpha)?" => "Controller_Boilerplateold",
	"workspace/:alpha/:alpha" => "Controller_Boilerplateold",

	"cli/?(:alpha)?" => "Controller_Cli",

	// "/boilerplate" => "Controller_Boilerplate",
	// "/boilerplate/:alpha" => "Controller_Boilerplate",
	// "/boilerplate/:alpha/:alpha" => "Controller_Boilerplate",

	// "/pages" => "Controller_Pages",
	// "/pages/:alpha" => "Controller_Pages",
	// "/pages/:alpha/:alpha" => "Controller_Pages",

	// "/example" => "Controller_Example",
	// "/example/:alpha" => "Controller_Example",
	// "/example/:alpha/:alpha" => "Controller_Example",

	// "/emails" => "Controller_Emails",
	// "/emails/:alpha" => "Controller_Emails",
	// "/emails/:alpha/:alpha" => "Controller_Emails",

	// "/" => "Controller_Boilerplate",
	// "/:alpha" => "Controller_Boilerplate",
	// "/:alpha/:alpha" => "Controller_Boilerplate",

	"/" => "Controller_Home",


	"/patterns" => "Controller_Pattern",
	"/patterns/:alpha" => "Controller_Pattern",
	"/patterns/:alpha/:alpha" => "Controller_Pattern",

	"/documentation" => "Controller_Documentation",
	"/documentation/:alpha" => "Controller_Documentation",
	"/documentation/:alpha/:alpha" => "Controller_Documentation",




	"/custom/pages" => "Controller_CustomPages",
	"/custom/pages/:alpha" => "Controller_CustomPages",
	"/custom/pages/:alpha/:alpha" => "Controller_CustomPages",

	"/custom/patterns" => "Controller_CustomPatterns",
	"/custom/patterns/:alpha" => "Controller_CustomPatterns",
	"/custom/patterns/:alpha/:alpha" => "Controller_CustomPatterns",

	"/example/emails" => "Controller_ExampleEmails",
	"/example/emails/:alpha" => "Controller_ExampleEmails",
	"/example/emails/:alpha/:alpha" => "Controller_ExampleEmails",

	"/example/project" => "Controller_ExampleProject",
	"/example/project/:alpha" => "Controller_ExampleProject",
	"/example/project/:alpha/:alpha" => "Controller_ExampleProject",




	"/builder" => "Controller_Builder",

	"/issues" => "Controller_Issues",
	"/issues/CPDP-:alpha" => "Controller_Issues",
	"/fileupload" => "Controller_Fileupload",
	'/ajax' => "Controller_Ajax",
	'/delegate/files/upload' => 'Controller_Ajax',
	'/hogan' => 'Controller_Hogan',
	'/hogan/:alpha' => 'Controller_Hogan',
));

// Router::serve(array(
// 	"/" => "Controller_Boilerplate",
// 	"/:alpha" => "Controller_Boilerplate",
// 	"/:alpha/:alpha" => "Controller_Boilerplate",
// ));
?>