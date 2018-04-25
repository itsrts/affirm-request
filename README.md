# affirm-request
make sure the request you initiate is completed

##Add new request
The application accepts a JSON just as 

{
    "requestid" : "orderid / instypeid / cartitemid",
    "vertical"  : "event",
    "url"       : "",
    "method"    : "GET (default)",
    "body"      : {},
    "maxLife"   : 180, //minutes
    "timeDiff"  : 15,  //seconds
    "dayEnd"    : true
}

endAt is the time after which the request is marked as cancelled
endAt = min(dayEndTime, currentTime + maxLife)

saves data in ES
{
    "requestid" : "",
    "vertical"  : "event callback",
    "uri"       : "",
    "body"      : {},
    "response"  : {},
    "noOfTry"   : 3,
    "createdAt" : "",
    "updatedAt" : "",
    "maxLife"   : 180, //minutes
    "timeDiff"  : 15,  //seconds
    "dayEnd"    : true,
    "status"    : "pending/done/cancelled",
    "endAt"     : "",
}

Returns a requestid
