## Auragraph

### Demo @ [Auragraph.io](https://auragraph.io)

### Authors
- [adamgemerson]('https://github.com/adamgemerson)

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

### What's Next?
>I intend to finish graphs for Artists themselves, that users can view when using the explore feature, but the methodology will have to be different due to the fact that spotify only assigns genres to artists, not to songs or albums.
> 
>I would also like to push the data visualizaion a bit further, with some more informative tooltips and additional ways to express a users aural proclivities.

### Screenshots

![Home Page](/readmeImages/homePage.png)
Home Page

![Your Auragraph](/readmeImages/yourAuragraph.png)
Your Auragraph

![Graph Closeup](/readmeImages/graphCloseUp.png)
Graph Closeup

![Explore](/readmeImages/explorePage.png)
Explore

![Artist](/readmeImages/artistPage.png)
Artist


### Supabase Integration
>**Supabase Auth** 
> 
>Auragraph leverages the Auth Supabase Spotify provider to connect with spotify and authenticate users. Protected routes are managed by next.js middleware as outlined in the Supabase docs. Spotify API calls are made using the `provider_token` retrieved from the user session.
>
> **Supabase Database**
> 
>Once a graph has been generated, the data is stored using Supabase Database. This allows us to reduce load times and api calls after the first visit. The graph is loaded from the database with SSR, and if that fails, API calls are made client side.
> 
>Due to the Spotify Developer restriction requiring that I manually approve users before they can authenticate with OAuth I have also set up a "request access" contact form which is being stored in a Supabase table as well.
>

![Auth](/readmeImages/authentication.png)
Auth

![Database](/readmeImages/auragraphTable.png)
Database



### Thanks
 Thank you to the devs who contributed to these amazing open source packages: 
 - [Supabase](https://supabase.com) 
 - [Next.js](https://nextjs.org/) 
 - [Mantine](https://mantine.dev)
 - [Spotify Web API Node](https://github.com/thelinmichael/spotify-web-api-node)
 - [benfred/venn.js](https://github.com/benfred/venn.js/)
 - [upset/venn.js](https://upset.js.org/venn.js/)
 - [D3](https://github.com/d3/d3)



