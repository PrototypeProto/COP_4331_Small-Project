<?php

    $inData = getRequestInfo();

    $UserID = $inData["UserID"];
    $Phone = $inData["Phone"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE Phone = ? AND UserID = ?");
        if(!$stmt)
        {
            returnWithError($conn->error);
        }
        else
        {
            $stmt->bind_param("si", $Phone, $UserID);
            if(!$stmt->execute())
            {
                returnWithError($stmt->error);
            }
            else
            {
                $stmt->close();
                $conn->close();
                returnWithError("");
            }
        }
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

?>
