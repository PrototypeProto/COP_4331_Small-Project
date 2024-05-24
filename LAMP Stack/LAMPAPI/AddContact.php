<?php

	$inData = getRequestInfo();
	
	$userId = $inData["UserID"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$email = $inData["Email"];
	$phone = $inData["Phone"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE Phone = ?")
        $stmt->bind_param("s", $phone);
        $stmt->execute();
        $rows = mysqli_num_rows($stmt->get_result(););
        if ($rows == 0)
        {
            $stmt = $conn->prepare("INSERT into Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?,?,?,?,?)");
            $stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
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