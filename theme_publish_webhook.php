<?php
require_once 'vendor/autoload.php';
require_once 'config.php';
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;



$config = Yaml::parseFile($configFile);

$jsonData = file_get_contents('php://input');
// $jsonData = '{"id":97573863563,"name":"7.30.20 - Update beginners \/ pro homepage section","created_at":"2020-07-29T19:12:31-04:00","updated_at":"2020-07-31T08:14:10-04:00","role":"main","theme_store_id":null,"previewable":true,"processing":false,"admin_graphql_api_id":"gid:\/\/shopify\/Theme\/97573863563"}';

$data = json_decode($jsonData);

if ($data->role == "main") {

	// Exit if its already in progress
	if (file_exists('log/lock')) {
		return;
	}
	touch("log/lock");

		// updated yml
	$config['development']['theme_id'] = $data->id;
	$config['production']['theme_id'] = $data->id;
	$yaml = Yaml::dump($config);

// 	var_dump($yaml);

	file_put_contents($configFile, $yaml);
	shell_exec("cd $repoDir; git add config.yml; git commit -m 'Auto-committing new published theme'; git push origin master; ");
	shell_exec("$projectDir/sync > /dev/null 2>/dev/null &");
}

$fp = fopen('log/log.txt', 'a');
// /*
fwrite($fp,  file_get_contents('php://input') . '
');
fclose($fp);
// */

unlink("log/lock");
