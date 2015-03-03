<?php
if (php_sapi_name() == 'cli-server') {
    /* route static assets and return false */
    if (preg_match('/\.(?:png|jpg|jpeg|gif|js|css|woff|html|ttf|svg)(\?)?/', $_SERVER["REQUEST_URI"])) {
	    return false;    // serve the requested resource as-is.
	}
}
ob_start("ob_gzhandler");

error_reporting(E_ALL ^ E_DEPRECATED);

define('SITE_PATH', dirname(__FILE__));
define('CALLED_FROM_FILE', true);

date_default_timezone_set("Europe/London");

require SITE_PATH . '/vendor/symfony/class-loader/Symfony/Component/ClassLoader/ClassLoader.php';
//require SITE_PATH . '/vendor/autoload.php';
use Symfony\Component\ClassLoader\ClassLoader;

require SITE_PATH . '/i/application/config/database.php';

require SITE_PATH . '/i/system/core/functions.php';
require SITE_PATH . '/i/system/core/blackgrid.class.php';
require SITE_PATH . '/i/system/core/collection.class.php';
require SITE_PATH . '/i/system/core/registry.php';
require SITE_PATH . '/i/system/core/stream.php';

require SITE_PATH . '/i/system/core/Toro.php';

class_alias('Toro', 'Router');
class_alias('ToroHook', 'Hook');

/*** FACTORIES ***/
require SITE_PATH . '/i/system/core/factories/controller.factory.php';
require SITE_PATH . '/i/system/core/factories/model.factory.php';
require SITE_PATH . '/i/system/core/factories/view.factory.php';
require SITE_PATH . '/i/system/core/blueprint.class.php';

require SITE_PATH . '/i/system/Library/events.class.php';
require SITE_PATH . '/vendor/zordius/lightncandy/src/lightncandy.php';
require SITE_PATH . '/i/system/core/handleview.php';

$loader = new ClassLoader();

/* Need to add configurable prefixes for custom plugins */
$loader->addPrefixes(array(
	'Mustache' 		=>  SITE_PATH . '/vendor/mustache/mustache/src',
	'Controller' 	=>  SITE_PATH . '/i/application',
	'Model' 		=>  SITE_PATH . '/i/application',
	'View' 			=>  SITE_PATH . '/i/application',
	'Domain'		=>  SITE_PATH . '/i/application',
	'Library' 		=>  SITE_PATH . '/i/application',
));
$loader->addPrefixes(array(
	'Library' 				=>  SITE_PATH . '/i/system',
));
$loader->register();

ToroHook::add("404",  function() {
	$obj = new Controller_Index();
	$obj->get();
});

/* Default Route */

require SITE_PATH . '/i/application/config/router.php';

if(IO::$returnJSON){
	print IO::flushJson();
}else{
	print IO::flush();
}



?>