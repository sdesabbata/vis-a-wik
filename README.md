# Vis-à-Wik

Visual analytics for Wikipedia analysis [(De Sabbata et al., 2015)](http://ssrn.com/abstract=2592528).

## Getting started

Vis-à-Wik is available at [sdesabbata.github.io/vis-a-wik](http://sdesabbata.github.io/vis-a-wik).

Vis-à-Wik retrieves data from the [Wikipedia API](http://www.mediawiki.org/wiki/API:Main_page), and uses [D3js](http://d3js.org/) to visualize the links between Wikipedia articles as a network diagram. Vis-à-Wik allows to search for Wikiepdia articles in a selected language edition, and visualize the articles selected by the user as a set of nodes, along with the related articles in a second language edition, and the links and language-links between them.

The aim is facilitate mid-scale analysis of Wikipedia content -- that is somewhere between a single-page analysis (that editors do routinely) and large-scale analyses (e.g., academic research projects).

## Motivation

#### Visual analytics

The term visual analytics was coined a decade ago by Thomas and Cook (2005) to refer to the “science of human analytical reasoning facilitated by interactive visualizations” (ibid: p.28). Visual analytics can be considered a direct descendant of the concept of exploratory data analysis proposed by Tukey (1977). The fundamental idea is to combine the computer capabilities in automatic analysis and the human capabilities in visual pattern recognition. The aim, therefore, is to address a particular class of problems, which are both too complex or ill-defined to be fully automatised (i.e., too hard for a computer), and involve datasets too large and diverse to be presented in a static visualization for humans to analyse (Keim et al, 2008; 2010).

#### Wikipedia content analysis

In [(De Sabbata et al., 2015)](http://ssrn.com/abstract=2592528), we argue that the analysis of Wikipedia content falls into the category of problems that visual analytics has been developed to tackle. The adequacy, correctness, completeness, and currency of Wikipedia articles and categories is a complex and ill-defined problem that could hardly be fully automatized. Moreover, information visualization methods have long been used by researchers to analyse and investigate Wikipedia contents, edits, editors and their geographies, as well as the differences between different editions.

Nonetheless, while ad-hoc processes and tools have so far been successfully used by researchers, such methods might not be suitable for Wikipedia contributors, who may lack the tools, time, or skills to perform the technical processes needed to create such visualizations. These factors serve as barriers limiting the number of people who have access to such analyses. In turn, not only the scope but especially the scale of such analyses is diminished. “Local” scale analyses might be of great interest and relevance to particular communities, groups, or individuals but might not be chosen as a research direction by professional scientists with a global audience in mind, or simply lacking local knowledge to do these subjects justice.

#### Vis-à-Wik

Vis-à-Wik is just a first step (hopefully) of a larger endeavour.

Wikipedia is one of the largest platforms based on the concept of asynchronous, distributed, collaborative work. A systematic collaborative exploration and assessment of Wikipedia content and coverage is still however largely missing. On the one hand editors routinely perform quality and coverage control of individual articles, while on the other hand academic research on Wikipedia is mostly focused on global issues, and only sporadically on local assessment. In [(De Sabbata et al., 2015)](http://ssrn.com/abstract=2592528), we argue that collaborative visualizations have the potential to fill this gap, affording editors to collaboratively explore and analyse patterns in Wikipedia content, at different scales. We illustrate how a collaborative visualization service can be an effective tool for editors to create, edit, and discuss public visualizations of Wikipedia data. Combined with the large Wikipedia user-base, and its diverse local knowledge, this could result in a large-scale collection of evidence for critique and activism, and the potential to enhance the quantity and quality of Wikipedia content.

**References**

De Sabbata, Stefano and Çöltekin, Arzu and Eccles, Katherine and Hale, Scott and Straumann, Ralph K, Collaborative Visualizations for Wikipedia Critique and Activism (April 9, 2015). In Proceedings of ICWSM. AAAI, Forthcoming. Available at SSRN: http://ssrn.com/abstract=2592528

Keim, D., Andrienko, G., Fekete, J. D., Görg, C., Kohlhammer, J., and Melançon, G. 2008. Visual analytics: Definition, process, and challenges (pp. 154-175). Springer Berlin Heidelberg.

Thomas, J. J., and Cook, K. A., 2005. Illuminating the path:[the research and devel-opment agenda for visual analytics]. IEEE Computer Society.

Tukey, J. W. 1977. Exploratory data analysis. Reading, Ma, 231, 32.

