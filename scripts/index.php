<?php

$action = filter_input(INPUT_GET, 'action');
if (!isset($action)) {
    $action = filter_input(INPUT_POST, 'action');
    if (!isset($action)) {
        header('Location: view/index.html');
    }
}

if ($action == 'upload') {

    $file = $_FILES['file'];
    $fileName = $_FILES['file']['name'];
    $fileTmpName = $_FILES['file']['tmp_name'];
    $fileSize = $_FILES['file']['size'];
    $fileError = $_FILES['file']['error'];
    $fileType = $_FILES['file']['type'];

    $fileExt = explode('.', $fileName);
    $fileActualExt = strtolower(end($fileExt));
    $allowed = 'xlsx';

    if ($fileActualExt === $allowed) {
        if ($fileError === 0) {
            if ($fileSize < 500000000) {
                $fileDestination = 'data/data.' . $fileActualExt;
                move_uploaded_file($fileTmpName, $fileDestination);
                header('Location: index.php?uploadsuccess');
            } else {
                echo "Your file is too big!";
            }
        } else {
            echo "An error occurred while uploading this file";
        }
    } else {
        echo "You cannot upload files this type";
    }
}
