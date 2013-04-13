<?php
$page = $_GET['page'];
$pageSize = $_GET['pagesize'];
$data['total'] = 100;
$start = ($page-1)*$pageSize+1;
for($i=$start;$i<$start+$pageSize;$i++){
    $data['data'][] = ['id'=>$i, 'name'=>"name $i"];
}
echo json_encode($data);
/*
data example:
{
    "total":100,
    "data": [
        { "id": "1" , "name" : "name 1"},
        { "id": "2" , "name" : "name 2"},
        { "id": "3" , "name" : "name 3"},
        { "id": "4" , "name" : "name 4"},
        { "id": "5" , "name" : "name 5"}
    ]
}
*/