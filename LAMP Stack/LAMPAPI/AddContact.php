<?php

    $inData = getRequestInfo();
    
    $UserID = $inData["UserID"];
    $FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $Email = $inData["Email"];
    $Phone = $inData["Phone"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE Phone = ?");
        if ($stmt === false) {
            returnWithError($conn->error);
            $conn->close();
            exit();
        }
        
        $stmt->bind_param("s", $Phone);
        $stmt->execute();
        $result = $stmt->get_result();
        $rows = $result->num_rows;
        
        if ($rows == 0)
        {
            $stmt = $conn->prepare("INSERT into Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?,?,?,?,?)");
            if ($stmt === false) {
                returnWithError($conn->error);
                $conn->close();
                exit();
            }
            
            $stmt->bind_param("issss", $UserID, $FirstName, $LastName, $Email, $Phone);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            http_response_code(200);
        }
        else
        {
            http_response_code(409);
            returnWithError("Duplicate contact");
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
