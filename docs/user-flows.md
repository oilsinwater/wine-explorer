# Wine Explorer User Flows

## Document Overview
This document describes the user flows for the Wine Explorer application. It details the steps users take to accomplish their goals, with ASCII representations of key screens in each flow.

## Flow 1: Dataset Selection and Initial Exploration

### User Goal
Quickly switch between red and white wine datasets to compare characteristics and begin exploration.

### Flow Steps
1. User accesses the Wine Explorer application
2. User views the default dataset (red wine)
3. User switches to the alternative dataset (white wine)
4. System loads and displays the new dataset
5. User begins exploring the data

### Screen Designs

**Initial Landing Screen (Red Wine Dataset)**
```
+-----------------------------------------------------+
| Wine Explorer                              [?] [i]  |
+-----------------------------------------------------+
| [Red] White  <<<<<<<<< Active dataset indicator     |
+-----------------------------------------------------+
| Dataset Information                                 |
| Source: UCI Machine Learning Repository             |
| DOI: 10.24432/C56S3T                                 |
| Instances: 1,599                                     |
+-----------------------------------------------------+
| [Alcohol Content] [pH Level] [Volatile Acidity]     |
| [=====|======] 9.0 - 14.0    [==|=======] 2.7-4.0   |
| [====|=======] 0.1 - 1.2                             |
+-----------------------------------------------------+
|                    VISUALIZATION AREA               |
|                                                     |
|         |^                                          |
|         | |                                         |
|         | |        *                               |
|   Count | |      *   *                              |
|         | |    *     *                              |
|         | |  *       *                              |
|         | |*         *                             |
|         |________________________>                  |
|         9.0                  Alcohol Content   14.0 |
+-----------------------------------------------------+
| Export: [CSV] [PNG] [SVG]                           |
+-----------------------------------------------------+
```

**After Switching to White Wine Dataset**
```
+-----------------------------------------------------+
| Wine Explorer                              [?] [i]  |
+-----------------------------------------------------+
|  Red [White]  <<<<<<<<< Active dataset indicator    |
+-----------------------------------------------------+
| Dataset Information                                 |
| Source: UCI Machine Learning Repository             |
| DOI: 10.24432/C56S3T                                 |
| Instances: 4,898                                     |
+-----------------------------------------------------+
| [Alcohol Content] [pH Level] [Volatile Acidity]     |
| [=====|======] 8.0 - 14.0    [==|=======] 2.7-3.8   |
| [====|=======] 0.1 - 1.1                             |
+-----------------------------------------------------+
|                    VISUALIZATION AREA               |
|                                                     |
|         |^                                          |
|         | |          *                              |
|         | |        * *                              |
|   Count | |      *   *                              |
|         | |    *     *                              |
|         | |  *       *                              |
|         | |*         * *                           |
|         |________________________>                  |
|         8.0                  Alcohol Content   14.0 |
+-----------------------------------------------------+
| Export: [CSV] [PNG] [SVG]                           |
+-----------------------------------------------------+
```

## Flow 2: Data Filtering and Exploration

### User Goal
Filter the dataset based on physicochemical features to focus analysis on specific subsets of interest.

### Flow Steps
1. User identifies filter controls for desired features
2. User adjusts range sliders or inputs values for filtering
3. System applies filter to dataset
4. System updates visualizations to show filtered data
5. User analyzes the filtered data

### Screen Designs

**Before Applying Filter**
```
+-----------------------------------------------------+
| Wine Explorer                              [?] [i]  |
+-----------------------------------------------------+
|  Red [White]                                         |
+-----------------------------------------------------+
| Dataset Information                                 |
| Source: UCI Machine Learning Repository             |
| Instances: 4,898                                     |
+-----------------------------------------------------+
| [Alcohol Content] [pH Level] [Volatile Acidity]     |
| [=====|======] 8.0 - 14.0    [=|========] 2.7-3.8   |
| [====|=======] 0.1 - 1.1                             |
+-----------------------------------------------------+
|                    VISUALIZATION AREA               |
|         |^                                          |
|         | |          *                              |
|         | |        * *                              |
|   Count | |      *   *                              |
|         | |    *     *                              |
|         | |  *       *                              |
|         | |*         * *                           |
|         |________________________>                  |
|         8.0                  Alcohol Content   14.0 |
+-----------------------------------------------------+
```

**After Applying Filter (Alcohol Content 10.0-12.0)**
```
+-----------------------------------------------------+
| Wine Explorer                              [?] [i]  |
+-----------------------------------------------------+
|  Red [White]                                         |
+-----------------------------------------------------+
| Dataset Information                                 |
| Source: UCI Machine Learning Repository             |
| Instances: 4,898 (Filtered: 2,345)                  |
+-----------------------------------------------------+
| [Alcohol Content] [pH Level] [Volatile Acidity]     |
| [=====|==    ] 10.0 - 12.0   [=|========] 2.7-3.8   |
| [====|=======] 0.1 - 1.1                             |
+-----------------------------------------------------+
|                    VISUALIZATION AREA               |
|         |^                                          |
|         | |        ***                              |
|         | |      * * *                              |
|   Count | |    *   * *                              |
|         | |  *     * *                              |
|         | |*       * *                              |
|         | |        * *                              |
|         |________________________>                  |
|         10.0                 Alcohol Content   12.0 |
+-----------------------------------------------------+
```

## Flow 3: Data Visualization and Analysis

### User Goal
Explore data distributions and relationships through histograms and scatterplots to identify patterns.

### Flow Steps
1. User views histogram for a selected feature
2. User identifies patterns or outliers in the distribution
3. User switches to scatterplot view
4. User views relationship between two features
5. User interprets the visualization

### Screen Designs

**Histogram View**
```
+-----------------------------------------------------+
| Wine Explorer                              [?] [i]  |
+-----------------------------------------------------+
|  Red [White]      [Histogram] Scatterplot           |
+-----------------------------------------------------+
| Dataset Information                                 |
| Source: UCI Machine Learning Repository             |
| Instances: 2,345                                     |
+-----------------------------------------------------+
|                    VISUALIZATION AREA               |
|                                                     |
|         |^                                          |
|         | |        ***                              |
|         | |      * * *                              |
|   Count | |    *   * *                              |
|         | |  *     * *                              |
|         | |*       * *                              |
|         | |        * *                              |
|         |________________________>                  |
|         10.0                 Alcohol Content   12.0 |
+-----------------------------------------------------+
```

**Scatterplot View**
```
+-----------------------------------------------------+
| Wine Explorer                              [?] [i]  |
+-----------------------------------------------------+
|  Red [White]      Histogram [Scatterplot]           |
+-----------------------------------------------------+
| Dataset Information                                 |
| Source: UCI Machine Learning Repository             |
| Instances: 2,345                                     |
+-----------------------------------------------------+
|                    VISUALIZATION AREA               |
|                                                     |
|   pH  |^                                          |
|   Lvl | |             *    *                        |
|       | |          *   *                           |
|       | |        *     *                           |
|       | |      *       *                           |
|       | |    *         *                           |
|       | |  *           * *                         |
|       | |*             *                           |
|       |________________________>                    |
|       10.0              Alcohol Content        12.0 |
+-----------------------------------------------------+
```

## Flow 4: Responsive Design Adaptation

### User Goal
Access and use the Wine Explorer effectively on different device sizes.

### Flow Steps
1. User accesses the Wine Explorer on a mobile device
2. System adapts layout for smaller screen
3. User interacts with the interface
4. User completes exploration tasks

### Screen Designs

**Mobile View**
```
+---------------------------------+
| Wine Explorer             [?] [i]|
+---------------------------------+
|  Red [White]                    |
+---------------------------------+
| Dataset Info                    |
| Instances: 2,345                |
+---------------------------------+
| [Alcohol] [pH] [Volatile Acid]  |
| [==|=======] 10.0-12.0          |
+---------------------------------+
| VISUALIZATION AREA              |
|       |^                        |
|       | |        ***            |
| Count | |      * * *            |
|       | |    *   * *            |
|       | |  *     * *            |
|       | |*       * *            |
|       |________________>        |
|       10.0     Alcohol    12.0  |
+---------------------------------+
| [Histogram] [Scatterplot]       |
+---------------------------------+
```

## Error States and Edge Cases

### Dataset Loading Failure
```
+-----------------------------------------------------+
| Wine Explorer                              [?] [i]  |
+-----------------------------------------------------+
|  Red [White]                                         |
+-----------------------------------------------------+
| ! Error loading dataset                             |
|                                                     |
| Unable to load wine dataset.                        |
| Please check your connection and try again.         |
|                                                     |
| [Retry]                                             |
+-----------------------------------------------------+
```

### No Data After Filtering
```
+-----------------------------------------------------+
| Wine Explorer                              [?] [i]  |
+-----------------------------------------------------+
|  Red [White]                                         |
+-----------------------------------------------------+
| Dataset Information                                 |
| Source: UCI Machine Learning Repository             |
| Instances: 4,898 (Filtered: 0)                      |
+-----------------------------------------------------+
| ! No data matches your filter criteria              |
|                                                     |
| Try adjusting your filters to include more data.    |
| [Reset Filters]                                     |
+-----------------------------------------------------+
```

## User Flow Success Metrics

To measure the effectiveness of our user flows, we'll track:
- Time to complete each flow (target < 1 minute)
- User success rate (target 95%)
- Error rate and recovery time
- User satisfaction scores

## Next Steps

1. Validate user flows with target users (Data Practitioners, Educators/Students)
2. Iterate on screen designs based on feedback
3. Implement flows in prototype
4. Conduct usability testing