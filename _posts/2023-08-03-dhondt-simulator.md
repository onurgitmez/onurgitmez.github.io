---
title: D'Hondt Election Simulator: A Powerful Tool for Electoral Analysis in R
date: 2023-08-03
permalink: /posts/2023/08/dhondt-simulator/
excerpt_separator: <!--more-->
toc: true
tags:
  - R
  - election-simulator
  - data-analysis
---

Today, I'm excited to introduce you to my first R package: the D'Hondt simulator.  It is a a powerful new tool for political scientists, statisticians, and anyone interested in electoral systems. This user friendly package allows users to simulate elections using the D'Hondt method, a highest averages method for allocating seats in party-list proportional representation.


<!--more-->

Visit the GitHub page for more information:

[D'Hondt Election Simulator R Package](https://github.com/onurgitmez/dhondt)

This package provides an easy-to-use and powerful simulation tool to conduct election simulations using the D'Hondt method in R.


The dhondt package is available directly from GitHub and can be installed using the devtools package in R:

```r

devtools::install_github("onurgitmez/dhondt")

```

## Usage

Start by loading the dhondt package:

```r

library(dhondt)

```

## Simulating an election

To simulate an election, you need a dataframe ('data') that includes the electoral district name ('district'), the number of seats available in that district ('seats'), and the number of votes each party received ('party1', 'party2', etc.).

Assuming the dataset is complete, you can simulate en election like this:


```r

election_results <- simulate_election(data, "district", "seats", c("party1", "party2"), threshold = 0.1, assign_to_env = TRUE, env_var_name = "election_results")

```

The 'threshold' argument specifies the national threshold required for a party to be eligible for seats. If desired, the resulting dataframe can be assigned to a global environment variable, 'election_results' for convenient access.

## Function

When you run the simulation of any election using the simulate_election() function in the dhondt package, the calculations are performed in the background using the D'Hondt method.

The function takes several arguments:

- df: Your dataframe with election data.
- district_col: The name of the column with district names.
- seats_col: The name of the column with the number of seats in each district.
- parties: A vector of party names, each matching a column in your dataframe. Each column holds the votes that party got in each district.
- threshold: (Optional) A vote share threshold that parties must exceed to be eligible for seats. Default is 0.
- assign_to_env: (Optional) If TRUE, the function's result is assigned to a variable in the global environment. Default is FALSE.
- env_var_name: (Optional) The name of the global environment variable to which the result is assigned, if assign_to_env is TRUE.

The simulate_election() function returns a list with two components:

Named Vector of Total Seats for Each Party: The first item is a named vector that displays the total seats won by each party. For instance, if three parties A, B, and C won 15, 10, and 5 seats respectively, the vector would show: partyA = 15, partyB = 10, partyC = 5.
Dataframe of Seats Won by Each Party in Each District: The second item is a dataframe that gives a district-wise breakdown of the results. It shows the seats each party won in each district, with a column for each party, a row for each district, and an additional row with the total seats won by each party across all districts.
This output provides both a bird's eye view and a detailed analysis of the election results, offering a comprehensive understanding of the electoral landscape.

More information on the package and an election  dataset shipped with the package for analysis can be found on the Github page.

For any questions or further details, please feel free to reach out to me.







