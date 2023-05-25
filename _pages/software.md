---
layout: archive
title: "Software"
permalink: /software/
author_profile: true
---

I developed a parliamentary election simulator for the 2023 Turkish National Elections. This application allows you to select a specific district and input the vote shares for different political parties. Using the D'Hondt method, the application calculates the allocation of seats for each party within that district. To access the simulator, please follow the link provided below:

[2023 Turkish Parliamentary Election Simulator](https://onurgitmez.shinyapps.io/2023TurkishElectionSimulator/)


{% include base_path %}


{% for post in site.software %}
  {% include archive-single.html %}
{% endfor %}

