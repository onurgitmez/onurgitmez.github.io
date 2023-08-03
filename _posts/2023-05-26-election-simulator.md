---
title: '2023 Turkish Election Simulator'
date: 2023-05-26
permalink: /posts/2023/05/election-simulator/
excerpt_separator: <!--more-->
toc: true
tags:
  - references
  - bash
---

In this blogpost I will talk about a software that I created using R Shiny. This software allows you to enter vote shares for parties that compete in 2023 Turkish General Elections for each electoral district. It then calculates the seat distribution using the D'Hondt method and creates a table for the seat distribution.

<!--more-->

2023 General Elections in Turkey sparked a debate on the best way to enter the election for parties. First, the threshold was decreased to 7% but alliance voting system which allowed parties to benefit from the distribution of alliance votes was removed. Following these changes, the discussion revolved around how smaller parties should enter the election and whether larger parties of the alliance can benefit from entering the election under a single ticket ——that is entering under the most powerful party in that district—— so that they will receive the most seats. 

In People’s Alliance, HUDA-PAR and DSP entered the election under the incumbent AKP, and MHP entered the election as a party. In Nation Alliance, Gelecek, Deva, DP, and SP entered the election from CHP lists and IYIP entered on itsown. The same issue was also discussed in Labour and Freedom Alliance where YSP and TIP entered under a general ticket in some districts but on their own in others. Turkey has 87 electoral districts with d’Hondt being used to allocate seats to parties in all of them. 


Following this discussion, I developed a parliamentary election simulator for the 2023 Turkish National Elections. This application allows you to select a specific district and input the vote shares for different political parties. Using the D'Hondt method, the application calculates the allocation of seats for each party within that district. To access the simulator, please follow the link provided below:

[2023 Turkish Parliamentary Election Simulator](https://onurgitmez.shinyapps.io/2023TurkishElectionSimulator/)

In this app which I created using R Shiny, you can choose the electoral district that you would like simulate on. Changing the district will also change the total number of seats to be allocated as shown in the table on the right. Let's choose Ankara-1 district. This is one of the three districts in Ankara. We can enter the approximate election results from the 2018 General Elections. 

One positive aspect of this simulator is that you are able to enter either the vote share or the number of votes received, depending on your preference and precision you would like. For the sake of simplicity, in this example we are going to use the vote shares. 

According to news sites in 2018 elections CHP won 35.78%, IYI won 12.5%, AKP won 29,57%, MHP won 10.58%, and HDP won 8.56% of the vote. We can enter these numbers to our simulator. When entering the vote shares you can notice two features of this simulator. The first one is you can see the total number of votes entered at the bottom of the right table. This is added to ensure when you make your own simulation you do not have to worry about going above 100% or not entering the desired share of votes. The second feature is that when you enter a party's vote it will be placed above others in the table. For example, if you entered CHP's vote last; it will be placed at top of the table since they earned the most seats from the district. This feature is added to make it easier to read the table and see the classification of parties quicker based on the number of seats they won.




