---
layout: page
title: Key Components
---

##### Apps
Collection of entities, intents and data sets

##### Clients
The interface between the framework and the end-point

##### Queue
Queue user input requests for memory and flood protection

##### Request
Handles the user input, finding which intent to use and calling the intent

##### Auth and Session
User pesistent sessions over multiple calls, with API token and context information

##### Learn
Classifier interfaces for matching user input to an intent

##### Entities
Data source for training the system and parsing parameters from user input. Comparable to a model in MVC.

##### Intents
Business logic for the users input. Comparable to a controller in MVC.

##### Parameters
Parses user input text