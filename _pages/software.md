---
layout: archive
title: "Software"
permalink: /software/
author_profile: true
---

# 2023 Turkish Parliamentary Election Simulator

I developed a parliamentary election simulator for the 2023 Turkish National Elections. This application allows you to select a specific district and input the vote shares for different political parties. Using the D'Hondt method, the application calculates the allocation of seats for each party within that district. To access the simulator, please follow the link provided below:

[2023 Turkish Parliamentary Election Simulator](https://onurgitmez.shinyapps.io/2023TurkishElectionSimulator/)

This is an example screenshot of the application.

<img src="/images/software/turkeyelectionsimulator.png" alt="Turkish Election Simulator-Seat Distribution" style="width:800px;height:800px;"/>


You can read more about the application in my blog post:

[2023 Turkish Parliamentary Election Simulator Blogpost](https://www.gitmez.com/posts/2023/05/election-simulator/)


# D'Hondt Simulator R Package

I created an R package that can simulate nation level election results using the D'Hondt allocation method. In this package, the command requires you to define the columns in your dataframe corresponding to elements such as district name, district size, party vote shares, define a nation level threshold, and whether you would like to save you simulation results as a new object in the environment. It then runs the simulation across all districts and gives you the seat distribution.


To access the package on Github, please follow the link provided below:

[D'Hondt Simulator in R](https://github.com/onurgitmez/dhondt)


You can read more about the application in my blog post:

[D'Hondt Election Simulator Blogpost](https://www.gitmez.com/posts/2023/08/dhondt-simulator/)





{% include base_path %}


{% for post in site.software %}
  {% include archive-single.html %}
{% endfor %}

