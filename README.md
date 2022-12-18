## Auragraph

### What is Auragraph?

> __Auragraph__ is a web application for Spotify users designed by a music enthusiast, for music enthusiasts. 
>
> 
>Auragraph aims to help users visualize the relationships between their favorite artists by generating colorful, interactive euler diagrams that we call, you guessed it, auragraphs.
>
> Spotify recognizes over 5000 unique genres of music. That's a lot to wade through! We hope that auragraph will enable people to better understand musical taxonomy while enabling the exploration and discovery of new sounds.
### How Does It Work?
>Once you have logged in with your Spotify account (thanks Supabase!), your favorite artists are retrieved via the Spotify API. With your favorite artists in hand, we can get to work on generating your very own auragraph.
> 
>Spotify assigns each artist any number of genres, but for our purposes we only care about the genres where your favorite artists overlap. If we didn't cull the dataset your graph would be full of disjoint outliers. Lame!
> 
>After we have removed any outlying genres, the euler diagram is generated with [D3](https://d3js.org/) and [venn.js](https://upset.js.org/venn.js/).
> 
>Depending on how diverse your listening habits are, your auragraph might be quite dense and difficult to parse, but you can explore the chart by toggling genres with the button above your graph.

### Observations On The Graph
> - The genres most represented amongst your top artists will be the drawn largest.
> - Toggle genres off and on to find new relationships in your graph.
> - Most graphs will have one or two central genres, like "Pop", or "Rap". 
> - If you turn the central genres off, your graph will become disjoint!.
> - Some genres will be represented as complete subsets of others. "Art Pop" and "Hyper Pop" for example. 

### Screenshots

![Home Page](/readmeImages/homePage.png)
Home Page

![Your Auragraph](/readmeImages/yourAuragraph.png)
Your Auragraph

![Graph Closeup](/readmeImages/graphCloseUp.png)
Your Auragraph

![Explore](/readmeImages/explorePage.png)
Explore

![Artist](/readmeImages/artistPage.png)
Artist


### Supabase Integration
Auragraph uses 

Auragraph was built with [Supabase](https://supabase.com), [Next.js](https://nextjs.org/), [Mantine](https://mantine.dev), and the [Spotify API](https://developer.spotify.com/).

### Team
- [adamgemerson]('https://github.com/adamgemerson)

### Supabase Implementation

Auragraph leverages the Authentication and Database services provided by Supabase. 

### Demo
Live Demo @ [Auragraph.io](https://auragraph.io)

