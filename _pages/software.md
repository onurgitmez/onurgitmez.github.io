---
layout: archive
title: "Software"
permalink: /software/
author_profile: true
---

For the 2023 Turkish National Elections, I created a simulator for the parliamentary elections. In this application, you choose the district that you wish to simulate and enter the vote shares for the parties. The application will calculate the seat distribution of parties within that district using the D'Hondt method. You can find the application in the link below:

[2023 Turkish Parliamentary Election Simulator](https://onurgitmez.shinyapps.io/2023TurkishElectionSimulator/)


{% include base_path %}


{% for post in site.software %}
  {% include archive-single.html %}
{% endfor %}

