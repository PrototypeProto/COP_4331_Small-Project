<?php

	$inData = getRequestInfo();

	$id = $inData["ID"];
	$newFirstName = $inData["FirstName"];
	$newLastName = $inData["LastName"];
	$newEmail = $inData["Email"];
	$newPhone = $inData["Phone"];
    	$favoriteStatus = $inData["Favorite"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
	    returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE Phone = ? and ID != ?");
	        if ($stmt === false) {
	            returnWithError($conn->error);
	            $conn->close();
	            exit();
	        }
	        
	        $stmt->bind_param("si", $newPhone, $id);
	        $stmt->execute();
	        $result = $stmt->get_result();
	        $rows = $result->num_rows;
        
        	if ($rows == 0)
        	{
            		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Favorite = ? WHERE ID = ?");
			if ($stmt === false) {
				returnWithError($conn->error);
				$conn->close();
				exit();
			}

			$stmt->bind_param("ssssii", $newFirstName, $newLastName, $newEmail, $newPhone, $favoriteStatus, $id);
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

?>
