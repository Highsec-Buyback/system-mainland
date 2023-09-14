# System Mainland

A service for EVE Online developers to determine if a system is in highsec mainland or not.

Currently uses the Red Frog API to gather the information.

## Usage

`GET https://bl8q6dawb3.execute-api.us-east-1.amazonaws.com/prod/mainland?systemName=Jita`

[Example in Code](https://github.com/Highsec-Buyback/hsbb-courier-helper-v2/blob/82ea3bbaa72a03c6ff483b198e1854a4e5d44da6/services/functions/build-couriers.ts#L182-L184)
