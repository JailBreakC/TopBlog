<?php
if(isset($_SERVER['HTTP_APPNAME'])){//SAE会生成一个HTTP_APPNAME判断一下它的存在可以方便本地调试
        //for sae
        $dbms='mysql';
        $dbName=SAE_MYSQL_DB;
        $user= SAE_MYSQL_USER;
        $pwd=SAE_MYSQL_PASS;
        $host=SAE_MYSQL_HOST_M.':'. SAE_MYSQL_PORT;
        $dsn="$dbms:host=$host;dbname=$dbName";
        $pdo=new PDO($dsn,$user,$pwd);
        $pdo->query("set names utf8");
        date_default_timezone_set('PRC');
}else
{
    //for local 
    $dsn = 'mysql:dbname=battlesnake;host=localhost';
    $user_name = 'root';
    $user_psw = '';
    $pdo = new PDO($dsn,$user_name,$user_psw);
    $pdo->query("set names 'utf8'");
    date_default_timezone_set('PRC');
}
if(isset($_POST['name'])){
    if(!(stripos($_POST['name'], '叶')===false)) {
        echo '你所在的ip段访问次数过多，请不要恶意访问'; 
        exit();
    };
    if($_POST['score'] <= 166){
        $query = "INSERT INTO `snakerank` (`name`, `score`) VALUES (?, ?);";
        $result = $pdo->prepare($query);
        $result -> bindParam(1,$_POST['name']);
        $result -> bindParam(2,$_POST['score']);
        $result->execute();
    }
}
$query = "SELECT * FROM `snakerank` ORDER BY `score` DESC LIMIT 0,10";
$result = $pdo->prepare($query);
$result->execute();
$result->setFetchMode(PDO::FETCH_ASSOC);
$result = $result->fetchAll();
echo json_encode($result);
?>