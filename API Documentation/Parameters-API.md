# APS Parameters API — Full Documentation

> Auto-generated on 2026-04-27 by scripts/scrape-docs.js

> Source: https://aps.autodesk.com/en/docs/parameters/v1/

---


---

## Developer's Guide


### Introduction

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/overview/introduction](https://aps.autodesk.com/en/docs/parameters/v1/overview/introduction)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/overview/introduction)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Developer's Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview)

# About the Parameters API

**The Parameters API lets you store and manage parameter definitions in the cloud.**

Parameters API supports cloud-hosted parameter definitions used across Autodesk workflows, including Revit and Forma-related experiences. It underpins the Parameters Service experience and allows you to access and extend parameter definitions programmatically.

Almost every Autodesk application has its own mechanism to manage parameters. Properties and attributes are alternative names for the same type of constructs.

Use of parameters is not limited to Autodesk products. By having definitions of parameters in the cloud, you can manage and organize them across workflows beyond Revit and Autodesk Forma.

The Parameters API lets you:

*   Keep a collection of parameters up to date and in sync across various products and services within the Autodesk ecosystem.
*   Work alongside the Revit API to load parameters from the service into Revit projects and families.
*   Allow administrators to manage parameter definitions, while collaborators, and team members can explore and load parameter definitions into their connected application.
*   Search for specific parameters or narrow down suitable options for meaningful consumption.
*   Set defaults for values like Revit Categories, type vs instance, and property palette group.
*   The Parameters Service management experience is currently available in Revit and for hub administrators in Autodesk Forma Library. For more information see [Parameters Service](https://help.autodesk.com/view/RVT/2023/ENU/?guid=GUID-073AB0E7-64BF-4A6E-9E67-59D3709266C3).

![Image 12: ../../../_images/aec_dc_illustration.png](https://developer.doc.autodesk.com/bPlouYTd/revit-forge-parameters-api-master-635380/_images/aec_dc_illustration.png)
**Common Uses**

The Parameters API offers the following features from the Parameters Service:

*   Groups
    *   Read: Retrieve all the parameter groups associated with a hub, currently only one group is supported per hub.
    *   Update: Update a parameter group

*   Collections
    *   Read: Retrieve one collection or all parameter collections associated with a parameter group
    *   Write: Create a collection
    *   Update: Update a collection

*   Parameters
    *   Read: Retrieve all parameters in a collection
    *   Read: Retrieve a parameter definition with its ID
    *   Create: Add a new parameter to a collection
    *   Create: Share a number of parameters to an existing collection
    *   Remove: Un-share a number of parameters from an existing collection
    *   Update: Modify a parameter
    *   Update: Mark a Parameter as archived
    *   Read: Search for parameters
    *   Read: Search parameters indices. The indices list value types, specs, and tags appearing among the parameters in the collection
    *   Read: Render parameters from the source unit or symbol to the target unit or symbol with the number format and precision

*   Labels
    *   Read: Retrieve labels used in a hub
    *   Create: Define a new label for a hub
    *   Update: Modify a label
    *   Delete: Delete a label
    *   Update: Add or remove labels from parameters

*   Parameter Classifications
    *   Read: Obtain details on disciplines, specs, units, classification groups, or Revit categories

**Next steps**

Familiarize yourself with how to get started with the Parameters API by following the [Step-by-Step tutorials](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/), where you can learn more about retrieving the hub context used by your parameters data.

Explore code samples to see how different API calls can be used as building blocks to deliver a meaningful solution.

Refer the API reference to discover the various options at your disposal, and the syntax to use. The API is built on the Autodesk Platform Services (APS), which includes services such as Authentication (OAuth). So, this API is ideally suited to seamlessly integrate with any product that operates within the same ecosystem.

In order to access and use Parameters API, a user must have the product access required for the workflow they are using, including Autodesk Forma access where applicable.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/introduction#)

Review settings

CONTINUE TO SITE

![Image 20](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/overview/introduction#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/introduction#) to learn more about your options. 

YES Decline


### Field Guide

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Developer's Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview)

# Field Guide

This section describes the terms used in Parameters API.

**Overview**

Parameters API stores parameter data within a Forma hub. Today, the primary management experience is available through Autodesk Forma hub administration. Parameters are organized by two layers of grouping: the first level under the hub is called “groups”, and the second “collections”. Currently, a hub may contain only one “group”. (This feature is reserved for future enhancement.) Each “group” can have multiple collections. The image below depicts the structure.

[![Image 12: ../../../_images/Field_Guide_Diagram.png](https://developer.doc.autodesk.com/bPlouYTd/revit-forge-parameters-api-master-635380/_images/Field_Guide_Diagram.png)](https://aps.autodesk.com/en/docs/_images/Field_Guide_Diagram.png)
A “parameter” is defined by its name and data type, and typically has additional metadata, such as a category and labels.

In the following, we explain each of these terms.

Organizational Structure of Parameters: - Parameter Group - Collection - Parameter

Composition of Parameter Metadata: - Spec - Unit - Label - Category - Classification Group

## [Parameter group](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#parameter-group)

A parameter group is a set of collections typically united by the same purpose.

Note: Currently only one group is supported and id is equal to hub id.

id

string: UUID The group ID.
title

string The group title.
description

string The group description.
createdBy

string The user who created the group.
createdAt

string The date that the group is created.
updatedBy

string The user who updated the group.
updatedAt

string The date that the group is updated.

### Relationships

`hub`

1-to-1 parent hub for this parameter collection
`collections`

1-to-many parameters contained within the parameter collection

### Example Object

```
{
  "id": "c23b5198ae2840a3a8ccc679903254c6",
  "title": "My Sample Group",
  "description": "This is my 1st sample group",
  "createdBy": "zlR4YAiokL302TZcopusRB0gHYBoaQGs",
  "createdAt": "2023-04-26T13:39:01+0000",
  "updatedBy": "WXE5QKQJUPV7",
  "updatedAt": "2023-04-27T04:27:57+0000"
}
```

Show More

## [Parameter collection](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#parameter-collection)

A parameter collection is a set of parameters typically united by the same purpose. A collection can represent any set of parameters that is convenient to your workflows.

e.g. Hospital/ School / Airport Parameters / Parameters to share with door contractor / Parameters for a given project owner.

Parameters should be created in your default collection and shared to other collections as needed, in order to match the current Parameters Service behavior.

id

string: UUID The collection ID.
name

string The collection name.
permissions

array: string The permissions of the user to access the parameters It could be read, write ,or admin.

### Relationships

`group`

1-to-1 parent group for this parameter collection
`parameters`

1-to-many parameters contained within the parameter collection

### Example Object

```
{
  "id": "02826a53ec-134b-0c98-0ab8-4af7a91214",
  "title": "Education Project Collection",
  "description": "Contains parameters for all education projects",
  "permissions": {
    "read": true,
    "write": false,
    "admin": false
  }
}
```

Show More

## [Parameter](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#parameter)

A parameter is the definition of a granular value of a model element. This may be called differently by applications such as Parameter / Property / Attribute​.

The id, name, specId and readOnly fields are the core definition of the parameter, which are immutable. The description and metadata could be changed by the [Patch Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH) API.

The core parameter definition can be retrieved by the [Get Parameter](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET). For this endpoint, the user (authorization token) does not need access to a given hub.

The parameter description and metadata are stored in the hub and collection, they can be retrieved by the [Retrieve Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET).

 Expand all

id

string The parameter ID.
name

string The parameter name.
description

string The parameter description.
specId

string The parameter spec ID.
readOnly

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set.
metadata

array: object The parameter metadata. It may vary from one product to another.

For example, to support the use of a parameter in Revit, the metadata object might record category bindings and an instance/type assignment.
anyOf
0

object An object with a string ID and a Boolean value. The ID could be one of the below:

“isHidden” to indicate if the parameter is hidden or not in the application.

“isArchived” to indicate if the parameter is archived or not.
id

string The metadata ID.
value

boolean Boolean value of the metadata.
1

object An object with a string ID and an enumerated string value. The ID could be “instanceTypeAssociation” to indicate if the parameter is associated with element instances, element types, or neither. Possible values: `NONE`, `INSTANCE`, `TYPE`
id

string The metadata ID.
value

string The metadata value.
2

object An object with a string ID and a string array value. The ID could be “labelIds” to list all the labels attached to this parameter.
id

string The metadata ID.
value

array: string The metadata value.
3

object An object with a string ID and an object value. The ID could be “group” to indicate the group for this parameter.
id

string The metadata ID.
value

object The metadata value.
bindingId

string The binding ID of the group, which can be looked up in the results of the GET /classifications/groups API.
id

string The group ID, which can be looked up in the results of the GET /classifications/groups API.
4

object An object with a string ID and an object array. The ID could be “categories” to indicate the categories of this parameter.
id

string The metadata ID.
value

array: object The metadata value.
bindingId

string The category binding ID, which can be looked up in the results of the GET /classifications/categories API.
id

string The category ID, which can be looked up in the results of the GET /classifications/categories API.
5

object An object with a string ID and a string value. The ID could be “specCategoryId” to indicate the spec category ID of this family type parameter.
id

string The metadata ID.
value

string The metadata value.

### Relationships

`parameter collection`

1-to-1 parent parameter collection for this parameter
`spec`

1-to-1 spec for the parameter
`label`

1-to-many labels attached to this parameter
`category`

1-to-many categories bind to this parameter
`group`

1-to-1 group bind to this parameter

### Example Object

```
{
  "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:000ccf6716504165b73d20739f7dc1bf-1.0.0",
  "name": "ArtificialLighting",
  "description": ""
  "specId": "autodesk.spec:spec.string-2.0.0",
  "readOnly": false,
  "metadata": [
    {
      "id": "isHidden",
      "value": false
    },
    {
      "id": "isArchived",
      "value": false
    },
    {
      "id": "labelIds",
      "value": [
        "ACSF-01105-DTLK-44382",
        "ADJH-96226-GAKC-59763",
        "ACSY-84419-DPLC-36868"
      ]
    },
    {
      "id": "group",
      "value": null
    },
    {
      "id": "instanceTypeAssociation",
      "value": "TYPE"
    },
    {
      "id": "categories",
      "value": [
        {
          "bindingId": "ACFT-94219-HCEE-04771",
          "id": "autodesk.revit.category.family:doors-1.0.0"
        }
      ]
    },
    {
      "id": "specCategory",
      "value": null
    }
  ]
}
```

Show More

## [Spec](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#spec)
A spec describes a data type for user-facing presentation. Specs assist in specifying custom properties in design applications, so that end users may select the correct data type for a property. Examples of spec objects: `Text`, `Yes/No`, `Image`, `Length`, or `Thermal Resistance`. A spec can be used to create a single or multiple select datatype for parameters when specifying an enumeration.

A spec object includes the following fields:

id

string The parameter spec ID.
name

string The user-facing name of the spec.
disciplineId

string The discipline ID. Look up detailed information in the response of the GET /disciplines API.
applicableUnitIds

array: string The identifiers of the units applicable to this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”.
storageUnitId

string The identifier of the storage unit of this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”. The storage unit is the unit of measurement that quantifies values of this parameter in persistent storage. When writing parameter values, client applications must ensure that the values written are quantified according to each parameter’s storage unit. A unit conversion might be necessary if input values are quantified differently.
valueTypeId

string The identifier of the storage value type, which could be Bool, Int64, Float64, Reference, String or a type ID. Using an enumeration type ID will allow you to define a custom data type using an enumeration.
context

string For enumerations only. The intended use of the spec in a list, to pick a single value or multiple values from the enumeration.

Specs allow version ranges to be defined for a valueTypeId. This allows enumerations to be updated and parameters using the spec will be able to get new data without changing the parameter’s version as well.

It is possible to specify a range of valid versions for a property. This may be valuable to allow some flexibility without introducing breaking changes.

Use >= to denote that you would like to accept any version greater than or equal to the specified version. For Example - “typeId”: “a.a:a->=1.0.1” would accept any version greater than or equal to 1.0.1.

Use ^ to denote that you would like to accept any version greater than or equal to the specified version, as long as it has the same major number. For Example - “typeId”: “a.a:a-^1.0.1” would accept any version greater than or equal to 1.0.1, but less than 2.0.0.

Use ~ to denote that you would like to accept any version greater than or equal to the specified version, as long as it has the same major and minor number. For Example - “typeId”: “a.a:a-~1.0.1” would accept any version greater than or equal to 1.0.1, but less than 1.1.0.

### Relationships

`parameter`

1-to-1 the parameter using this spec
`discipline`

1-to-1 the discipline for this spec
`unit`

1-to-many the units associated with this spec
`enumeration`

1-to-1 the enumeration used by this spec, if used as the spec’s valueTypeId

### Example Object

```
{
  "id": "autodesk.spec.aec.electrical:apparentPower-2.0.0",
  "name": "Apparent Power",
  "disciplineId": "autodesk.spec.discipline:electrical-1.0.0",
  "applicableUnitIds": [
      "autodesk.unit.unit:watts-1.0.1",
      "autodesk.unit.unit:kilowatts-1.0.1",
      "autodesk.unit.unit:britishThermalUnitsPerSecond-1.0.1",
      "autodesk.unit.unit:britishThermalUnitsPerHour-1.0.1",
      "autodesk.unit.unit:caloriesPerSecond-1.0.1",
      "autodesk.unit.unit:kilocaloriesPerSecond-1.0.1",
      "autodesk.unit.unit:voltAmperes-1.0.1",
      "autodesk.unit.unit:kilovoltAmperes-1.0.1",
      "autodesk.unit.unit:horsepower-1.0.1"
  ],
  "storageUnitId": "autodesk.unit.unit:watts-1.0.1"
}
```

Show More

## [Enumeration](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#enumeration)
An enumeration describes a user-defined list for creating specs that facilitate the single or multiple selection data type. Enumerations assist in specifying a custom list of options/values for a parameter to use. An enumeration object includes the following fields:

id

string The enumeration ID.
name

string The user-facing name of the enumeration.
content

map A map of IDs and values for available options in the list. Look up detailed information in the response of the GET /enumerations API.

### Relationships

`spec`

1-to-many the specs using this enumeration

### Example Object

```
{
  "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:61712b031b1e49e897e3cf1643dea73f-2.0.0",
  "name": "Streetlight Colors",
   "Content": [
       {
                  "id": "Red",
                  "value": 0
              },
              {
                  "id": "Yellow",
                  "value": 1
              },
              {
                  "id": "Green",
                  "value": 2
              }
        ],
              "createdBy": "FXA2K4JGR5BECGSR",
              "createdAt": "2024-11-11T16:22:29+0000"
        },
}
```

Show More

## [Unit](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#unit)
A unit defines a standard representation of units and formatting rules.

id

string The unit ID.
name

string The unit name.
symbolIds

array: string The identifiers of symbols that indicate this unit in a written measurement, such as the “m” indicating “meters” in a written measurement such as “5m”. A unit of measurement may have zero, one, or many symbols available. Symbols may be used when rendering parameters.

### Relationships

`spec`

1-to-1 the parent spec
`symbol`

1-to-many all the symbols of the unit

### Example Object

```
{
  "id": "autodesk.unit.unit:feet-1.0.1",
  "name": "Feet",
  "symbolIds": [
      "autodesk.unit.symbol:feetAndInches-1.0.1",
      "autodesk.unit.symbol:footSingleQuote-1.0.1",
      "autodesk.unit.symbol:ft-1.0.1",
      "autodesk.unit.symbol:lf-1.0.1"
  ]
}
```

Show More

## [Label](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#label)
A label is a meta-data that is attached to specific parameter that help search and filter parameters

id

string The label ID.
name

string The label name.
description

string The label description.

### Relationships

`parameters`

1-to-many the parameters attached with the label.

### Example Object

```
{
  "id": "ACMT-69415-CEVT-22201",
  "name": "test",
  "description": ""
}
```

## [Category](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#category)
A category controls the organization, visibility, graphical representations, and scheduling options of Families within the Project.

id

string The category ID.
name

string The category name.
disciplineIds

array: string The discipline IDs of this category. Look up detailed information in the response of the GET /disciplines API.
parentCategoryId

string The parent category ID of this category.
bindingId

string The bindingId of this this category. It is used to create the parameters with categories, which will help to organize the parameters in different categories in the application, like Revit. The category can’t be bound to any parameters if the bindingId is null.

### Relationships

`parameter`

1-to-1 the parameter associated with this category
`discipline`

1-to-many the disciplines for this category

### Example Object

```
{
  "id": "autodesk.revit.category.family:fireProtection-1.0.0",
  "name": "Fire Protection",
  "disciplineIds": [
    "autodesk.spec.discipline:architecture-1.0.0",
    "autodesk.spec.discipline:structural-1.0.0",
    "autodesk.spec.discipline:hvac-1.0.0",
    "autodesk.spec.discipline:electrical-1.0.0",
    "autodesk.spec.discipline:piping-1.0.0",
    "autodesk.spec.discipline:infrastructure-1.0.0"
  ],
  "parentCategoryId": null,
  "bindingId": "ACFT-94213-BNDF-85095"
}
```

Show More

## [Classification Group](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#classification-group)
A classification group helps to organize the parameters in the application, like Revit property pallet group.

id

string The classification group ID.
name

string The classification group name.
bindingId

string The binding ID of this group. It is used to create parameters with group binding, which will help to organize the parameters in different groups in the application, like Revit. The group can’t be bound to any parameters if the bindingId is null.

### Relationships

`parameter`

1-to-1 the parameter associated with this group

### Example Object

```
{
  "id": "autodesk.parameter.group:adskModelProperties-1.0.0",
  "name": "Model Properties",
  "bindingId": "ABXZ-68714-GYLB-48622"
}
```

## [Limitations](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#limitations)
The following list details known limitations of the current release of the Parameters API:

*   Search APIs will return a (200) response even if it returns with errors in the response instead of a (207)
*   Attach Labels API will return a (201) response even if it returns with errors in the response instead of a (207)
*   Detach Labels API will return a (204) response even if it returns with errors in the response instead of a (207)
*   Update or Detach Labels APIs can update parameters outside the specified collection in certain instances.

[![Image 13: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 17](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#)

Review settings

CONTINUE TO SITE

![Image 20](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide#) to learn more about your options. 

YES Decline


### Rate Limits and Quotas

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Developer's Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview)

# APS Rate Limits and Quotas

The Autodesk Platform Service (APS) provides a set of cloud resources that are shared among many applications and services. Autodesk strives to ensure that there are plenty of cloud resources to serve all platform users. However, runaway applications and malicious attacks can quickly consume resources and diminish service. To avoid overconsumption and service degradation, APS sets rate limits and quotas for users of each of its services. This page describes how those rate limits and quotas work.

## [Rate Limits](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits#rate-limits)
Rate limits are simple: a rate limit sets the maximum number of API calls an application can make per minute. Rate limits help keep the number of API calls within the capacity of the service, and guard against instability and attacks such as denial-of-service attacks. This ensures availability and consistent quality of service for all users.

The rate limits may vary by each service or by endpoints within a service. Rate limits are currently placed at a generous level that shouldn’t cause problems with applications running under normal circumstances. They may come into play and limit an application if the application generates an unusually high volume of API calls.

Rate limits are not guaranteed service levels. If a service is overloaded for any reason, request rate limits may effectively drop until the overload condition ends.

### Notification

When an application exceeds the published rate limit for a given endpoint, the API returns an `HTTP 429 "Too many requests"` response code. The response header has a parameter named `Retry-After` that specifies how many seconds to wait before making a new request. We strongly recommend that you retry a request only after the waiting period has elapsed.

The following example shows a typical 429 response.

#### Response Header (429)

```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 25
Server: Apigee Router
Content-Length: 44
```

#### Response Body (429)

```
{"developerMessage":"Quota limit exceeded."}
```

## [Quotas](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits#quotas)
Quotas come into play after a service request is accepted. A quota limits an application’s use of resources as the application carries out activities within an APS service. Quotas may limit, for example, file sizes uploaded, downloaded, and processed; the amount of processing time allowed per job; an application’s monthly service consumption; and so on. Each APS service may have a set of built-in quotas. They may also offer custom quotas that a user or application can set to lower resource consumption below the built-in limits if desired to further restrict resource use.

Note again that quotas are not guaranteed service levels. Quota limits may drop temporarily if a service is overloaded.

### Notification

Exceeding a quota typically occurs when an API request specifies excessive resource use. The service receiving the request replies with an error response that specifies the quota violation. Sometimes, where resource use doesn’t occur until after a request is received (the request places a job on a queue, for example), the quota violation occurs during later execution and throws an error there. In that case the requester may set up a callback to provide error notification. If a callback isn’t possible, the requester can poll regularly (but not too frequently) to make sure that execution is carried out correctly.

## [Scope](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits#scope)
The scope of APS rate limits and quotas (how widely or narrowly they apply) varies across APIs and resource types. Scope is defined by how request rate or resource use is tallied: on the client side whether it’s tallied per user ID or application, for example, and on the service side whether it’s applied across an entire API, for example, or to individual endpoints or resources within an API.

### Rate Limit Scope

Rate limits on the client side may apply per user ID or per application. On the service side, a rate limit may apply across an entire API or to individual endpoints within an API, changing from one endpoint to another.

### Quota Scope

Quotas on the client side may apply per user ID or per application. On the service side, they may apply to a particular resource type, to the underlying engine servicing a request, to an endpoint, or other qualifying attributes. Because quotas are typically resource-specific, their scope is often narrowly defined.

API specific rate limit and quota pages spell out the scope for each API’s rate limit and quota.

## [Requesting Rate Limit and Quota Changes](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits#requesting-rate-limit-and-quota-changes)
If a rate limit or quota causes problems for an application with reasonable resource use, you can request a limit or quota change by contacting support via [https://aps.autodesk.com/get-help](https://aps.autodesk.com/get-help).

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits#)

Review settings

CONTINUE TO SITE

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits#) to learn more about your options. 

YES Decline


### Forge Rate Limits

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Developer's Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview)

# APS Rate Limits and Quotas

The Autodesk Platform Service (APS) provides a set of cloud resources that are shared among many applications and services. Autodesk strives to ensure that there are plenty of cloud resources to serve all platform users. However, runaway applications and malicious attacks can quickly consume resources and diminish service. To avoid overconsumption and service degradation, APS sets rate limits and quotas for users of each of its services. This page describes how those rate limits and quotas work.

## [Rate Limits](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits#rate-limits)
Rate limits are simple: a rate limit sets the maximum number of API calls an application can make per minute. Rate limits help keep the number of API calls within the capacity of the service, and guard against instability and attacks such as denial-of-service attacks. This ensures availability and consistent quality of service for all users.

The rate limits may vary by each service or by endpoints within a service. Rate limits are currently placed at a generous level that shouldn’t cause problems with applications running under normal circumstances. They may come into play and limit an application if the application generates an unusually high volume of API calls.

Rate limits are not guaranteed service levels. If a service is overloaded for any reason, request rate limits may effectively drop until the overload condition ends.

### Notification

When an application exceeds the published rate limit for a given endpoint, the API returns an `HTTP 429 "Too many requests"` response code. The response header has a parameter named `Retry-After` that specifies how many seconds to wait before making a new request. We strongly recommend that you retry a request only after the waiting period has elapsed.

The following example shows a typical 429 response.

#### Response Header (429)

```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 25
Server: Apigee Router
Content-Length: 44
```

#### Response Body (429)

```
{"developerMessage":"Quota limit exceeded."}
```

## [Quotas](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits#quotas)
Quotas come into play after a service request is accepted. A quota limits an application’s use of resources as the application carries out activities within an APS service. Quotas may limit, for example, file sizes uploaded, downloaded, and processed; the amount of processing time allowed per job; an application’s monthly service consumption; and so on. Each APS service may have a set of built-in quotas. They may also offer custom quotas that a user or application can set to lower resource consumption below the built-in limits if desired to further restrict resource use.

Note again that quotas are not guaranteed service levels. Quota limits may drop temporarily if a service is overloaded.

### Notification

Exceeding a quota typically occurs when an API request specifies excessive resource use. The service receiving the request replies with an error response that specifies the quota violation. Sometimes, where resource use doesn’t occur until after a request is received (the request places a job on a queue, for example), the quota violation occurs during later execution and throws an error there. In that case the requester may set up a callback to provide error notification. If a callback isn’t possible, the requester can poll regularly (but not too frequently) to make sure that execution is carried out correctly.

## [Scope](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits#scope)
The scope of APS rate limits and quotas (how widely or narrowly they apply) varies across APIs and resource types. Scope is defined by how request rate or resource use is tallied: on the client side whether it’s tallied per user ID or application, for example, and on the service side whether it’s applied across an entire API, for example, or to individual endpoints or resources within an API.

### Rate Limit Scope

Rate limits on the client side may apply per user ID or per application. On the service side, a rate limit may apply across an entire API or to individual endpoints within an API, changing from one endpoint to another.

### Quota Scope

Quotas on the client side may apply per user ID or per application. On the service side, they may apply to a particular resource type, to the underlying engine servicing a request, to an endpoint, or other qualifying attributes. Because quotas are typically resource-specific, their scope is often narrowly defined.

API specific rate limit and quota pages spell out the scope for each API’s rate limit and quota.

## [Requesting Rate Limit and Quota Changes](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits#requesting-rate-limit-and-quota-changes)
If a rate limit or quota causes problems for an application with reasonable resource use, you can request a limit or quota change by contacting support via [https://aps.autodesk.com/get-help](https://aps.autodesk.com/get-help).

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits#) to learn more about your options. 

YES Decline


### Parameters API Rate Limits

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Developer's Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview)

# Parameters API Rate Limits and Quotas

The Parameters API observes a set of rate limits to ensure that all clients get sufficient service and that runaway applications don’t consume excessive resources. You’ll find general information about rate limits in [APS Rate Limits and Quotas](https://aps.autodesk.com/en/docs/bim360/v1/overview/rate-limits/forge-rate-limits).

These rate limits apply across all of the Parameters API’s endpoints, although they’re separately set for each requesting application (specified by the client ID). Note that these rates are not service guarantees. In the uncommon case where total service use is too high across all clients, accepted request rates may drop until traffic subsides.

## [Endpoint Groups](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits#endpoint-groups)
Different rate limits apply to the different types of parameter endpoints. Parameter endpoints with /parameters/v1/accounts/ in the base URL have a limit of 300 requests per minute, and other endpoints has a limit of 14000 requests per minute.

### Rate Limits for Parameters API Endpoints

The following table describes the rate limits for endpoints within the Parameters API:

| Endpoints | Limit (Requests/minute) | Scope |
| --- | --- | --- |
| All endpoints with /parameters/v1/accounts/ in the base URL | 300 | Per application (specified by client ID) |
| All endpoints with /parameters/v1/disciplines in the base URL | 14000 | All applications (client IDs) across all /parameters/v1/disciplines endpoints |
| All endpoints with /parameters/v1/specs in the base URL | 14000 | All applications (client IDs) across all /parameters/v1/specs endpoints |
| All endpoints with /parameters/v1/units in the base URL | 14000 | All applications (client IDs) across all /parameters/v1/units endpoints |
| All endpoints with /parameters/v1/classification/ in the base URL | 14000 | All applications (client IDs) across all /parameters/v1/classification/ endpoints |

## [Scope](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits#scope)
The Parameters API measures requests per application as specified by the Client ID for all endpoints with /parameters/v1/accounts/ in the base URL. All other endpoints are tracked globally, independent of any given Client ID.

## [Violation Notification](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits#violation-notification)
If an application exceeds an endpoint group’s rate limit, the Parameters API returns an HTTP 429 error (described in detail in [APS Rate Limits and Quotas](https://aps.autodesk.com/en/docs/bim360/v1/overview/rate-limits/forge-rate-limits)).

## [Changing Limits](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits#changing-limits)
[APS Rate Limits and Quotas](https://aps.autodesk.com/en/docs/bim360/v1/overview/rate-limits/forge-rate-limits) describes how to request rate limit changes for APS APIs.

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits#) to learn more about your options. 

YES Decline


---

## Tutorials


### Getting Started

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Step-by-Step Tutorials](https://aps.autodesk.com/en/docs/parameters/v1/tutorials)

# Retrieve Hub ID

This tutorial demonstrates how to identify the hub ID used with Parameters API. If you already have them, you can skip this tutorial.

## [Before You Begin](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started#before-you-begin)
*   [Register an app](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app/), and select the Data Management and Autodesk Forma APIs.
*   Acquire a [3-legged OAuth token](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) with `data:create``data:read` and `data:write` scopes.
*   Verify that you have access to the relevant Autodesk Forma hub, project, and folder.
*   **Important:** make sure that the hub you are trying to access has the Parameters Service feature activated in the UI. To activate it, access Autodesk Forma as a hub admin, navigate to the Library tab > Parameters, and select “+ Create parameter collection” to initialize the Parameters Service for your hub. This is required to use the Parameters API with that hub.

## [Find the Hub ID](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started#find-the-hub-id)
Find the hub ID for the hub you are interested in by calling [GET hubs](https://aps.autodesk.com/en/docs/data/v2/reference/http/hubs-GET/).

Note that the Parameters API hub ID is a raw UUID. To use it with the Data Management API, add a “**b.**" prefix. For example, a hub ID of d952a4eb-ad57-4d64-b9ab-d540b3b4522e translates to a Data Management hub ID of **b.**d952a4eb-ad57-4d64-b9ab-d540b3b4522e.

### Request

```
curl -X GET -H "Authorization: Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT" "https://developer.api.autodesk.com/project/v1/hubs"
```

### Response

```
{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": {
      "href": "https://developer.api.autodesk.com/project/v1/hubs"
    }
  },
  "data": [
    {
      "type": "hubs",
      "id": "b.d6cf8c84-c25e-4534-ae5c-62e08480e751",
      "attributes": {
        "name": "My First Account",
        "extension": {
          "type": "hubs:autodesk.acc:Account",
          "version": "1.0",
          "schema": {
            "href": "https://developer.api.autodesk.com/schema/v1/versions/hubs:autodesk.acc:Account-1.0"
          },
          "data": {}
        }
      }
    }
  ]
}
```

Show More

In this example, assume that the hub you are interested in is in a hub called **My First Account**.

Find the hub (`data.name`), and note the hub ID - `b.d6cf8c84-c25e-4534-ae5c-62e08480e751`.

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started#) to learn more about your options. 

YES Decline


### Retrieve ACC Account

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Step-by-Step Tutorials](https://aps.autodesk.com/en/docs/parameters/v1/tutorials)

# Retrieve Hub ID

This tutorial demonstrates how to identify the hub ID used with Parameters API. If you already have them, you can skip this tutorial.

## [Before You Begin](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account#before-you-begin)
*   [Register an app](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app/), and select the Data Management and Autodesk Forma APIs.
*   Acquire a [3-legged OAuth token](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) with `data:create``data:read` and `data:write` scopes.
*   Verify that you have access to the relevant Autodesk Forma hub, project, and folder.
*   **Important:** make sure that the hub you are trying to access has the Parameters Service feature activated in the UI. To activate it, access Autodesk Forma as a hub admin, navigate to the Library tab > Parameters, and select “+ Create parameter collection” to initialize the Parameters Service for your hub. This is required to use the Parameters API with that hub.

## [Find the Hub ID](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account#find-the-hub-id)
Find the hub ID for the hub you are interested in by calling [GET hubs](https://aps.autodesk.com/en/docs/data/v2/reference/http/hubs-GET/).

Note that the Parameters API hub ID is a raw UUID. To use it with the Data Management API, add a “**b.**" prefix. For example, a hub ID of d952a4eb-ad57-4d64-b9ab-d540b3b4522e translates to a Data Management hub ID of **b.**d952a4eb-ad57-4d64-b9ab-d540b3b4522e.

### Request

```
curl -X GET -H "Authorization: Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT" "https://developer.api.autodesk.com/project/v1/hubs"
```

### Response

```
{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": {
      "href": "https://developer.api.autodesk.com/project/v1/hubs"
    }
  },
  "data": [
    {
      "type": "hubs",
      "id": "b.d6cf8c84-c25e-4534-ae5c-62e08480e751",
      "attributes": {
        "name": "My First Account",
        "extension": {
          "type": "hubs:autodesk.acc:Account",
          "version": "1.0",
          "schema": {
            "href": "https://developer.api.autodesk.com/schema/v1/versions/hubs:autodesk.acc:Account-1.0"
          },
          "data": {}
        }
      }
    }
  ]
}
```

Show More

In this example, assume that the hub you are interested in is in a hub called **My First Account**.

Find the hub (`data.name`), and note the hub ID - `b.d6cf8c84-c25e-4534-ae5c-62e08480e751`.

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account#) to learn more about your options. 

YES Decline


### Parameters Overview

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Step-by-Step Tutorials](https://aps.autodesk.com/en/docs/parameters/v1/tutorials)

# Retrieve Parameters

This tutorial demonstrates how to retrieve a hub’s Parameter collection.

## [Before You Begin](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters#before-you-begin)
*   [Register an app](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app/)
*   Acquire a [3-legged OAuth token](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) with the `data:read` scope.
*   Verify that you have access to the relevant Forma hub or Forma project.

## [Step 1: Find the Group and Collection IDs](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters#step-1-find-the-group-and-collection-ids)
Use the Hub ID you obtained from the earlier step to retrieve the hub’s parameter groups by calling [GET Parameter Groups](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET). Here we use 9ba6681e-1952-4d54-aac4-9de6d9858dd4 as hub id. Note: currently, only one group is supported, and group id is equal to hub id. Supporting multiple groups is considered for future enhancement.

### Request

```
curl "https://developer.api.autodesk.com/parameters/v1/accounts/9ba6681e-1952-4d54-aac4-9de6d9858dd4/groups" -X GET \
  -H "Authorization: Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT" \
```

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 50
  },
  "results": [
    {
      "id": "9ba6681e-1952-4d54-aac4-9de6d9858dd4",
      "title": "My Sample Group",
      "description": "This is my 1st sample group",
      "createdBy": "zlR4YAiokL302TZcopusRB0gHYBoaQGs",
      "createdAt": "2023-04-26T13:39:01+0000",
      "updatedBy": "WXE5QKQJUPV7",
      "updatedAt": "2023-04-27T04:27:57+0000"
    }
  ]
}
```

Show More

The response payload includes the Parameter Group ID (`results[0].id`).

Then use the hub ID and the group ID to retrieve the hub’s parameter collections by calling [GET Parameter Collections](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET).

### Request

```
curl "https://developer.api.autodesk.com/parameters/v1/accounts/9ba6681e-1952-4d54-aac4-9de6d9858dd4/groups/9ba6681e-1952-4d54-aac4-9de6d9858dd4/collections" -X GET \
  -H "Authorization: Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT" \
```

### Response

```
{
  "pagination": {
      "offset": 0,
      "limit": 50
  },
  "results": [
      {
          "id": "8f40c4ae-99cc-4651-834f-7a51e19224d3",
          "title": "Sample Collection",
          "description": "This is my 1st sample Collection",
          "group": {
              "id": "9ba6681e-1952-4d54-aac4-9de6d9858dd4"
          },
          "account": {
              "id": "9ba6681e-1952-4d54-aac4-9de6d9858dd4"
          },
          "createdBy": "zlR4YAiokL302TZcopusRB0gHYBoaQGs",
          "createdAt": "2023-04-26T13:39:01+0000",
          "updatedBy": "WXE5QKQJUPV7",
          "updatedAt": "2023-05-03T20:40:43+0000"
      }
  ]
}
```

Show More

The response payload includes the Parameter Collection ID (`results[0].id`).

## [Step 2: Gets the Parameters](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters#step-2-gets-the-parameters)
Use the hub ID (`9ba6681e-1952-4d54-aac4-9de6d9858dd4`), group ID (`9ba6681e-1952-4d54-aac4-9de6d9858dd4`), and parameter collection ID (`8f40c4ae-99cc-4651-834f-7a51e19224d3`) from the previous step to retrieve the collection’s parameters by calling [GET Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET).

### Request

```
curl "https://developer.api.autodesk.com/construction/parameters/v1/accounts/9ba6681e-1952-4d54-aac4-9de6d9858dd4/groups/9ba6681e-1952-4d54-aac4-9de6d9858dd4/collections/8f40c4ae-99cc-4651-834f-7a51e19224d3/parameters" -X GET \
  -H "Authorization: Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT" \
```

### Response

```
{
  "pagination": {
    "limit": 50,
    "offset": 0,
    "totalResults": 3235,
    "nextUrl": "https://developer.api.autodesk.com/parameters/v1/accounts/9ba6681e-1952-4d54-aac4-9de6d9858dd4/groups/9ba6681e-1952-4d54-aac4-9de6d9858dd4/collections/8f40c4ae-99cc-4651-834f-7a51e19224d3/parameters?offset=50&limit=50"
  },
  "results": [
    {
      "id": "parameters.9ba6681e-1952-4d54-aac4-9de6d9858dd4:000ccf6716504165b73d20739f7dc1bf-1.0.0",
      "name": "ArtificialLighting",
      "readOnly": false,
      "description": ""
      "specId": "autodesk.spec:spec.bool-1.0.0",
      "metadata": [
        {
          "id": "isHidden",
          "value": false
        },
        {
          "id": "isArchived",
          "value": false
        },
        {
          "id": "labelIds",
          "value": [
            "ACSF-01105-DTLK-44382",
            "ADJH-96226-GAKC-59763",
            "ACSY-84419-DPLC-36868"
          ]
        },
        {
          "id": "group",
          "value": {
              "bindingId": "ABXZ-68714-GYLB-48622",
              "id": "autodesk.parameter.group:adskModelProperties-1.0.0"
          }
        },
        {
          "id": "instanceTypeAssociation",
          "value": "NONE"
        },
        {
          "id": "categories",
          "value": [
            {
              "bindingId": "ACFT-94206-BGDE-78534",
              "id": "autodesk.revit.category.family:abutmentFoundations-1.0.0"
            }
          ]
        }
      ],
      "createdBy": "YZVYJQWWAJ89",
      "createdAt": "2023-02-02T10:20:11Z"
    },
  ]
}
```

Show More

Congratulations! You have retrieved Parameters.

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters#) to learn more about your options. 

YES Decline


### Retrieve ACC Parameters Data

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Step-by-Step Tutorials](https://aps.autodesk.com/en/docs/parameters/v1/tutorials)

# Retrieve Parameters

This tutorial demonstrates how to retrieve a hub’s Parameter collection.

## [Before You Begin](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data#before-you-begin)
*   [Register an app](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app/)
*   Acquire a [3-legged OAuth token](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) with the `data:read` scope.
*   Verify that you have access to the relevant Forma hub or Forma project.

## [Step 1: Find the Group and Collection IDs](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data#step-1-find-the-group-and-collection-ids)
Use the Hub ID you obtained from the earlier step to retrieve the hub’s parameter groups by calling [GET Parameter Groups](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET). Here we use 9ba6681e-1952-4d54-aac4-9de6d9858dd4 as hub id. Note: currently, only one group is supported, and group id is equal to hub id. Supporting multiple groups is considered for future enhancement.

### Request

```
curl "https://developer.api.autodesk.com/parameters/v1/accounts/9ba6681e-1952-4d54-aac4-9de6d9858dd4/groups" -X GET \
  -H "Authorization: Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT" \
```

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 50
  },
  "results": [
    {
      "id": "9ba6681e-1952-4d54-aac4-9de6d9858dd4",
      "title": "My Sample Group",
      "description": "This is my 1st sample group",
      "createdBy": "zlR4YAiokL302TZcopusRB0gHYBoaQGs",
      "createdAt": "2023-04-26T13:39:01+0000",
      "updatedBy": "WXE5QKQJUPV7",
      "updatedAt": "2023-04-27T04:27:57+0000"
    }
  ]
}
```

Show More

The response payload includes the Parameter Group ID (`results[0].id`).

Then use the hub ID and the group ID to retrieve the hub’s parameter collections by calling [GET Parameter Collections](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET).

### Request

```
curl "https://developer.api.autodesk.com/parameters/v1/accounts/9ba6681e-1952-4d54-aac4-9de6d9858dd4/groups/9ba6681e-1952-4d54-aac4-9de6d9858dd4/collections" -X GET \
  -H "Authorization: Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT" \
```

### Response

```
{
  "pagination": {
      "offset": 0,
      "limit": 50
  },
  "results": [
      {
          "id": "8f40c4ae-99cc-4651-834f-7a51e19224d3",
          "title": "Sample Collection",
          "description": "This is my 1st sample Collection",
          "group": {
              "id": "9ba6681e-1952-4d54-aac4-9de6d9858dd4"
          },
          "account": {
              "id": "9ba6681e-1952-4d54-aac4-9de6d9858dd4"
          },
          "createdBy": "zlR4YAiokL302TZcopusRB0gHYBoaQGs",
          "createdAt": "2023-04-26T13:39:01+0000",
          "updatedBy": "WXE5QKQJUPV7",
          "updatedAt": "2023-05-03T20:40:43+0000"
      }
  ]
}
```

Show More

The response payload includes the Parameter Collection ID (`results[0].id`).

## [Step 2: Gets the Parameters](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data#step-2-gets-the-parameters)
Use the hub ID (`9ba6681e-1952-4d54-aac4-9de6d9858dd4`), group ID (`9ba6681e-1952-4d54-aac4-9de6d9858dd4`), and parameter collection ID (`8f40c4ae-99cc-4651-834f-7a51e19224d3`) from the previous step to retrieve the collection’s parameters by calling [GET Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET).

### Request

```
curl "https://developer.api.autodesk.com/construction/parameters/v1/accounts/9ba6681e-1952-4d54-aac4-9de6d9858dd4/groups/9ba6681e-1952-4d54-aac4-9de6d9858dd4/collections/8f40c4ae-99cc-4651-834f-7a51e19224d3/parameters" -X GET \
  -H "Authorization: Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT" \
```

### Response

```
{
  "pagination": {
    "limit": 50,
    "offset": 0,
    "totalResults": 3235,
    "nextUrl": "https://developer.api.autodesk.com/parameters/v1/accounts/9ba6681e-1952-4d54-aac4-9de6d9858dd4/groups/9ba6681e-1952-4d54-aac4-9de6d9858dd4/collections/8f40c4ae-99cc-4651-834f-7a51e19224d3/parameters?offset=50&limit=50"
  },
  "results": [
    {
      "id": "parameters.9ba6681e-1952-4d54-aac4-9de6d9858dd4:000ccf6716504165b73d20739f7dc1bf-1.0.0",
      "name": "ArtificialLighting",
      "readOnly": false,
      "description": ""
      "specId": "autodesk.spec:spec.bool-1.0.0",
      "metadata": [
        {
          "id": "isHidden",
          "value": false
        },
        {
          "id": "isArchived",
          "value": false
        },
        {
          "id": "labelIds",
          "value": [
            "ACSF-01105-DTLK-44382",
            "ADJH-96226-GAKC-59763",
            "ACSY-84419-DPLC-36868"
          ]
        },
        {
          "id": "group",
          "value": {
              "bindingId": "ABXZ-68714-GYLB-48622",
              "id": "autodesk.parameter.group:adskModelProperties-1.0.0"
          }
        },
        {
          "id": "instanceTypeAssociation",
          "value": "NONE"
        },
        {
          "id": "categories",
          "value": [
            {
              "bindingId": "ACFT-94206-BGDE-78534",
              "id": "autodesk.revit.category.family:abutmentFoundations-1.0.0"
            }
          ]
        }
      ],
      "createdBy": "YZVYJQWWAJ89",
      "createdAt": "2023-02-02T10:20:11Z"
    },
  ]
}
```

Show More

Congratulations! You have retrieved Parameters.

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data#) to learn more about your options. 

YES Decline


### Create Parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Step-by-Step Tutorials](https://aps.autodesk.com/en/docs/parameters/v1/tutorials)

# Create Parameters

This tutorial demonstrates how to create a hub’s parameter collection and parameters.

## [Before You Begin](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#before-you-begin)
*   [Register an app](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app/)
*   Acquire a [3-legged OAuth token](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) with the `data:read data:write` scope.
*   Verify that you have access to the relevant Forma hub or Forma project.

## [Step 1: Find the Group IDs](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#step-1-find-the-group-ids)
Note: currently, only one group is supported, and group id is equal to hub id. Supporting multiple groups is considered for future enhancement. You may choose to use group id = hub id and skip this step to obtain group id.

The following example shows how to retrieve the hub’s parameter groups by calling GET Parameter Groups. Here we assume hub id is 009777bb-e1e5-4577-9800-0789677e4616.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups' \
  -H 'Authorization: Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT'
```

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 20,
    "totalResults": 1
  },
  "results": [
    {
      "id": "009777bb-e1e5-4577-9800-0789677e4616",
      "title": "Default Group",
      "description": "Contains collections for this account",
      "createdBy": "GB82ZDWDRBMUV38U",
      "createdAt": "2023-05-13T00:19:40+0000",
      "updatedBy": "4V4WKQJGGQ7N",
      "updatedAt": "2023-10-20T15:36:15+0000"
    }
  ]
}
```

Show More

## [Step 2: Create and update a new collection](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#step-2-create-and-update-a-new-collection)
*   Use the hub ID and the group ID to create a parameter collections, by calling [POST Parameter Collections](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT).
*   The following example shows how to create a parameter collection.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "title": "Cool Parameter Collection",
        "description": "My parameters for Cool Project 1"
      }'
```

Show More

### Response

```
{
  "collectionId": "a9974bd0-546d-4cba-a434-cdea5fb70bf8",
  "title": "Cool Parameter Collection",
  "description": "My parameters for Cool Project 1"
}
```

*   You can update the collection’s title and description by calling [PUT Parameter Collections](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT).
*   The following example shows how to update the collection.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/a9974bd0-546d-4cba-a434-cdea5fb70bf8' \
  -X 'PUT' \
  -H 'Content-Type: application/json' \
  -d '{
        "title": "My Cool Parameters",
        "description": "Collection for my cool parameters"
      }'
```

### Response

```
{
  "id": "a9974bd0-546d-4cba-a434-cdea5fb70bf8",
  "title": "My Cool Parameters",
  "description": "Collection for my cool parameters"
}
```

## [Step 3: Create a couple of parameters](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#step-3-create-a-couple-of-parameters)
*   Using the hub ID (`009777bb-e1e5-4577-9800-0789677e4616`), group ID (`009777bb-e1e5-4577-9800-0789677e4616`), and parameter collection ID (`a9974bd0-546d-4cba-a434-cdea5fb70bf8`) from the previous step, you can create multiple parameters under the new collection by calling [POST Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST).
*   Please note that you can only set id, name, dataTypeId, and readOnly. For the description and metadata, please use the update parameters API in the following step to set them.
*   Parameters should be created in your default collection and shared to other collections as needed, in order to match the behavior of the Parameters Service.

The following example shows how to create a couple of parameters.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/a9974bd0-546d-4cba-a434-cdea5fb70bf8/parameters' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '[
        {
          "name": "window width",
          "dataTypeId": "autodesk.spec.aec:length-2.0.0",
          "readOnly": true
        },
        {
          "name": "window length",
          "dataTypeId": "autodesk.spec.aec:length-2.0.0",
          "readOnly": true
        }
      ]'
```

Show More

### Response

```
{
  "results": [
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:9fa3644ac1984fca987fe1d5dc701120-1.0.0",
      "name": "window width",
      "specId": "autodesk.spec.aec:length-2.0.0",
      "readOnly": true,
      "createdBy": "200809200167579",
      "createdAt": "2023-10-03T22:29:43+0000"
    },
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:885621e67e7f4e49b9754b657ea476dc-1.0.0",
      "name": "window length",
      "specId": "autodesk.spec.aec:length-2.0.0",
      "readOnly": true,
      "createdBy": "200809200167579",
      "createdAt": "2023-10-03T22:29:43+0000"
    }
  ]
}
```

Show More

## [Step 4: Modify a couple of parameters](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#step-4-modify-a-couple-of-parameters)
*   Using the hub ID (`009777bb-e1e5-4577-9800-0789677e4616`), group ID (`009777bb-e1e5-4577-9800-0789677e4616`), and parameter collection ID (`a9974bd0-546d-4cba-a434-cdea5fb70bf8`) from the previous step, to update the new parameters by their ids, call [PATCH Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH).
*   Please note that you can set or modify metadata with isHidden, revitCategoryBindingIds, instanceTypeAssociation and labelIds.
*   Note: Responses may include pimPropBehavior and pimPropDMBehavior for each parameter. This is for internal use only.

The following example shows how to modify a couple of parameters.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/a9974bd0-546d-4cba-a434-cdea5fb70bf8/parameters' \
  -X 'PATCH' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '[
        {
          "id": "parameters.009777bbe1e5457798000789677e4616:9fa3644ac1984fca987fe1d5dc701120-1.0.0",
          "description": "The width of a window",
          "metadata": [
              {
                  "id": "instanceTypeAssociation",
                  "value": "INSTANCE"
              },
              {
                  "id": "labelIds",
                  "value": [
                      "ACVA-80318-CKKJ-05645"
                  ]
              },
              {
                  "id": "categoryBindingIds",
                  "value": [
                      "ACFV-53198-BRVZ-83753"
                  ]
              }
          ]
        },
        {
          "id": "parameters.009777bbe1e5457798000789677e4616:885621e67e7f4e49b9754b657ea476dc-1.0.0",
          "description": "the length of an entire window when several are combined",
          "metadata": [
            {
              "id": "isHidden",
              "value": true
            }
          ]
        }
      ]'
```

Show More

### Response

```
{
  "results": [
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:9fa3644ac1984fca987fe1d5dc701120-1.0.0",
      "name": "window width",
      "description": "The width of a window",
      "specId": "autodesk.spec.aec:length-2.0.0",
      "readOnly": false,
      "metadata": [
          {
              "id": "isHidden",
              "value": false
          },
          {
              "id": "isArchived",
              "value": false
          },
          {
              "id": "instanceTypeAssociation",
              "value": "INSTANCE"
          },
          {
              "id": "categories",
              "value": [
                  {
                      "bindingId": "ACFV-53198-BRVZ-83753",
                      "id": "autodesk.revit.category.family:abutmentFoundations-1.0.0"
                  }
              ]
          },
          {
              "id": "labelIds",
              "value": [
                  "ACVA-80318-CKKJ-05645"
              ]
          },
          {
              "id": "group",
              "value": null
          },
          {
              "id": "pimPropBehavior",
              "value": null
          },
          {
              "id": "pimPropDMBehavior",
              "value": null
          }
      ],
      "createdBy": "200809200167579",
      "createdAt": "2022-10-18T17:16:05+0000"
    },
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:885621e67e7f4e49b9754b657ea476dc-1.0.0",
      "name": "window length",
      "description": "the length of an entire window when several are combined",
      "specId": "autodesk.spec.aec:length-2.0.0",
      "readOnly": false,
      "metadata": [
          {
              "id": "isHidden",
              "value": true
          },
          {
              "id": "isArchived",
              "value": false
          },
          {
              "id": "instanceTypeAssociation",
              "value": "INSTANCE"
          },
          {
              "id": "categories",
              "value": [
                  {
                      "bindingId": "ACFV-53198-BRVZ-83753",
                      "id": "autodesk.revit.category.family:windows-1.0.0"
                  }
              ]
          },
          {
              "id": "labelIds",
              "value": [
                  "ACVA-80318-CKKJ-05645"
              ]
          },
          {
              "id": "group",
              "value": null
          },
          {
              "id": "pimPropBehavior",
              "value": null
          },
          {
              "id": "pimPropDMBehavior",
              "value": null
          }
      ],
      "createdBy": "200809200167579",
      "createdAt": "2022-10-18T17:16:05+0000"
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters#) to learn more about your options. 

YES Decline


### Search Parameters Indices and Parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Step-by-Step Tutorials](https://aps.autodesk.com/en/docs/parameters/v1/tutorials)

# Search Parameters and Indices

This tutorial demonstrates how to search for parameter, and search indices in a parameter collection with different filters.

## [Before You Begin](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters#before-you-begin)
*   [Register an app](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app/)
*   Acquire a [3-legged OAuth token](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) with the `data:search` scope.
*   Verify that you have access to the relevant Forma hub or Forma project.

## [Search Filters](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters#search-filters)
The search filters are used to search for parameters in a parameter collection. The search filters are listed below:

*   The searchedText filter is used to search for parameters with the search string in the parameter name.
*   The sort filter is used to sort the parameters with the sort order.
*   The labelIds filter is used to search for parameters with the label binding. It is an array of label ids. The result contains the parameters that have the label binding with any label in this array.
*   The dataTypeIds filter is used to search for parameters with the dataType binding. It is an array of dataType ids. The result contains the parameters that have the dataType binding with any dataType in this array.
*   The category filter is used to search for parameters with the category binding. It is an array of category ids. The result contains the parameters that have the category binding with any category in this array.
*   The group filter is used to search for parameters with the group binding. It is a group ID. The result contains the parameters that have the group binding.
*   The isInstance filter is used to search for parameters with the instance metadata.
*   The isType filter is used to search for parameters with the type metadata.
*   The isArchived filter is used to search for parameters with the archived metadata.
*   The isHidden filter is used to search for parameters with the hidden metadata.

The following example searches for parameters in a collection with the search filters, by calling [POST Search Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/d05ec054-ef80-46ad-9c80-fc742f29027c/groups/d05ec054-ef80-46ad-9c80-fc742f29027c/collections/028b3307-91aa-45ec-864c-1c4af88b8a08/parameters:search' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "searchedText": "Artificial",
        "isArchived": false,
        "sort": "NAME_ASCENDING"
      }'
```

Show More

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 21,
    "nextUrl": "https://developer.api.autodesk.com/parameters/v1/accounts/d05ec054-ef80-46ad-9c80-fc742f29027c/groups/d05ec054-ef80-46ad-9c80-fc742f29027c/collections/028b3307-91aa-45ec-864c-1c4af88b8a08/parameters:search?offset=50&limit=50"
  },
  "results": [
    {
      "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:000ccf6716504165b73d20739f7dc1bf-1.0.0",
      "name": "ArtificialLighting",
      "description": ""
      "specId": "autodesk.spec:spec.string-2.0.0",
      "readOnly": false,
      "metadata": [
        {
          "id": "isHidden",
          "value": false
        },
        {
          "id": "isArchived",
          "value": false
        },
        {
          "id": "labelIds",
          "value": [
            "ACSF-01105-DTLK-44382",
            "ADJH-96226-GAKC-59763",
            "ACSY-84419-DPLC-36868"
          ]
        },
        {
          "id": "group",
          "value": null
        },
        {
          "id": "instanceTypeAssociation",
          "value": "TYPE"
        },
        {
          "id": "categories",
          "value": [
            {
              "bindingId": "ACFT-94219-HCEE-04771",
              "id": "autodesk.revit.category.family:doors-1.0.0"
            }
          ]
        },
        {
          "id": "specCategory",
          "value": null
        }
      ]
    },
  ]
}
```

Show More

## [Parameter Indices](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters#parameter-indices)
Parameter indices are an overview of all parameters in a parameter collection. They contain the following information:

*   The labels attached to the parameters in the collection and the count of parameters with the each label.
*   The data types of the parameters in the collection and the count of the parameters with each data type.
*   The category bindings of the parameters in the collection and the count of the parameters with each category.
*   The group bindings of the parameters in the collection and the count of the parameters with each group.
*   The count of instance parameters in the collection.
*   The count of type parameters in the collection.
*   The count of archived parameters in the collection.
*   The count of hidden parameters in the collection.

The following example searches for parameter indices in the collection, by calling [POST Search Parameters indices](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/internal/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/parameters:search-indices' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "isArchived": false,
        "dataTypeIds": ["autodesk.spec:spec.string-2.0.0"],
        "sort": "NAME_ASCENDING"
      }'
```

Show More

### Response

```
{
  "dataTypes": [
    {
      "typeId": "autodesk.spec:spec.string-2.0.0",
      "count": 24
    }
  ],
  "labels": [
    {
      "id": "ACSF-01105-DTLK-44382",
      "count": 10
    },
    {
      "id": "ACTL-74886-BQNU-54596",
      "count": 10
    },
    {
      "id": "ACSY-84419-DPLC-36868",
      "count": 6
    },
    {
      "id": "ACVE-47566-JESZ-35795",
      "count": 3
    },
    {
      "id": "ACVE-40432-GAMP-63893",
      "count": 1
    }
  ],
  "categoryBindings": [
    {
      "id": "ACFT-94219-HCEE-04771",
      "count": 2
    },
    {
      "id": "ACFT-94219-HCZK-47813",
      "count": 2
    }
  ],
  "groupBindings": [
    {
      "id": "ABXZ-68714-GTBT-61905",
      "count": 2
    }
  ],
  "instances": 1,
  "types": 1,
  "hiddens": 0,
  "archives": 0
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters#)

Review settings

CONTINUE TO SITE

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters#) to learn more about your options. 

YES Decline


### Create Enumerations

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[Step-by-Step Tutorials](https://aps.autodesk.com/en/docs/parameters/v1/tutorials)

# Create Enumerations

This tutorial demonstrates how to create Enumerations (Lists) for use within Specs that can be used to create Single or Multiple Select Parameters.

## [Before You Begin](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#before-you-begin)
*   [Register an app](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app/)
*   Acquire a [3-legged OAuth token](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) with the `data:read data:write` scope.
*   Verify that you have access to the relevant Forma project.
*   Verify that you have your Forma hub GUID.

## [Step 1: Find existing Enumerations](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#step-1-find-existing-enumerations)
Use the following to find all existing enumerations for a hub.

Here we assume hub ID is `b3aef626-f535-4c7a-a032-c1048416f5ea`.

### Request

```
curl -v 'https://developer-stg.api.autodesk.com/parameters/v1/accounts/enumerations?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
   "results": [
       {
           "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73d-2.0.0",
           "name": "some enumeration",
           "content": [
               {
                   "id": "item11",
                   "value": 0
               },
               {
                   "id": "item2",
                   "value": 1
               }
           ],
           "createdBy": "FXA2K4JGR5BECGSK",
           "createdAt": "2024-11-11T16:22:29+0000"
       },
       {
           "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:d4756f9ff2d94b1b92cbf0eaf34662ce-1.0.0",
           "name": "test 746",
           "content": [
               {
                   "id": "test746",
                   "value": 0
               }
           ],
           "createdBy": "FXA2K4JGR5BECGSK",
           "createdAt": "2024-08-30T16:45:41+0000"
       }
   ],
   "pagination": {
       "offset": 0,
       "limit": 50,
       "totalResults": 2
   }
 }
```

Show More

## [Step 2: Create New Enumeration(s)](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#step-2-create-new-enumeration-s)
*   For this example, we are still using the hub ID (`b3aef626-f535-4c7a-a032-c1048416f5ea`)
*   Please note that you can only set ID, name, and content. Specs will reference the enumeration by its ID and specify how it should be used.
*   Enumerations are stored separately from your parameters in the system.

The following example shows how to create enumerations.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/enumerations:batch-create?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2F' \
  -H 'Content-Type: application/json' \
  -d '{
        "enumerations": [
          {
            "name": "Stoplight Color",
            "content": [
              {
                "id": "Red",
                "value": 0
              },
              {
                "id": "Yellow",
                "value": 1
              },
              {
                "id": "Green",
                "value": 2
              }
            ]
          }
        ]
     }'
```

Show More

### Response

```
{
  "results": [
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
          "name": "Stoplight Color",
          "content": [
              {
                "id": "Red",
                "value": 0
              },
              {
                "id": "Yellow",
                "value": 1
              },
              {
                "id": "Green",
                "value": 2
              }
          ],
          "createdBy": "FXA2K4JGR5BECGSF",
          "createdAt": "2024-11-11T16:18:53+0000"
      }
  ]
}
```

Show More

## [Step 3: Add a New Item to an Enumeration](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#step-3-add-a-new-item-to-an-enumeration)
*   In this example, we will add a new value to the enumeration we created in the previous step, which will increment its version number to 1.1.0.
*   For this example, we are still using the hub ID (`b3aef626-f535-4c7a-a032-c1048416f5ea`).

The following example shows how to update enumerations.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/enumerations:batch-update?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'PATCH' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
         "enumerations": [
          {
            "name": "Stoplight Color",
            "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.0",
            "content": [
              {
                "id": "Red",
                "value": 0
              },
              {
                "id": "Yellow",
                "value": 1
              },
              {
                "id": "Green",
                "value": 2
              },
              {
                "id": "Turn Arrow",
                "value": 3
              }
            ]
          },
          {
            "name": "Installation Complete",
            "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:b3aef626f5354c7aa032c1048416f5ea-1.0.0",
            "content": [
              {
                "id": "Yes",
                "value": 21
              },
              {
                "id": "No",
                "value": 22
              },
              {
                "id": "Back-ordered",
                "value": 23
              }
            ]
          }
        ]
      }'
```

Show More

### Response

```
{
  "results": [
      {
          "name": "Stoplight Color",
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.1",
          "previousRevisionId": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.0",
          "content": [
            {
              "id": "Red",
              "value": 0
            },
            {
              "id": "Yellow",
              "value": 1
            },
            {
              "id": "Green",
              "value": 2
            },
            {
              "id": "Turn Arrow",
              "value": 3
            }
          ],
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-19T19:31:46+0000"
      },
      {
         "name": "Installation Complete",
          "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:b3aef626f5354c7aa032c1048416f5ea-1.0.1",
          "previousRevisionId": "parameters.d05ec054ef8046ad9c80fc742f29027c:b3aef626f5354c7aa032c1048416f5ea-1.0.0",
          "content": [
            {
              "id": "Yes",
              "value": 21
            },
            {
              "id": "No",
              "value": 22
            },
            {
              "id": "Back-ordered",
              "value": 23
            }
          ],
          "createdBy": "DWFAK4JGR5BECGSR",
          "createdAt": "2024-12-19T19:31:46+0000"
      }
  ]
}
```

Show More

## [Step 4: Find Existing User-Defined Specs](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#step-4-find-existing-user-defined-specs)
Use the following to find all existing user-defined specs for a Forma hub.

*   Here we assume hub ID is `b3aef626-f535-4c7a-a032-c1048416f5ea`.
*   If you do not pass a hub ID, all system specs will be listed.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea'
    -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "results": [
    {
      "id": "autodesk.spec.aec.structural:linearMomentScale-2.0.0",
      "name": "Linear Moment Scale",
      "disciplineId": "autodesk.spec.discipline:structural-1.0.0",
      "applicableUnitIds": [
        "autodesk.unit.unit:feetPerKip-1.0.0",
        "autodesk.unit.unit:metersPerKilonewton-1.0.0"
      ],
      "storageUnitId": "autodesk.unit.unit:metersPerKilonewton-1.0.0",
      "valueTypeId": "Float64",
      "context": "single",
      "createdBy": "System Generated",
      "createdAt": "System Generated"
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 1
  }
}
```

Show More

## [Step 5: Create a New Spec for Use With Single or Multiple Select Parameters](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#step-5-create-a-new-spec-for-use-with-single-or-multiple-select-parameters)
*   For this example, we are still using the hub ID (`b3aef626-f535-4c7a-a032-c1048416f5ea`).
*   Please note that you can only set which enumeration to use and whether it is a `single` or `array` data type.
*   `single` is for single select parameters, and `array` is for multi-select parameter data types.

The following example shows how to create specs.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs:batch-create?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "specs": [
          {
            "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
            "context": "single"
          },
          {
            "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
            "context": "array"
          }
        ]
       }'
```

Show More

### Response

```
{
  "results": [
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:8bb37d61b3dc489aa94d6bac3d88038c-1.0.0",
          "name": "Multiple Select: some spec",
          "valueTypeId": "b3aef626-f535-4c7a-a032-c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
          "context": "array",
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-11T16:18:56+0000",
          "disciplineId": "autodesk.spec:discipline-2.0.0",
          "applicableUnitIds": null,
          "storageUnitId": null,
          "content": [
              {
                  "id": "item1",
                  "value": 0
              },
              {
                  "id": "item2",
                  "value": 1
              }
          ]
      },
      {
          "id": "b3aef626-f535-4c7a-a032-c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-1.0.0",
          "name": "Single Select: some spec",
          "valueTypeId": "b3aef626-f535-4c7a-a032-c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
          "context": "single",
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-11T16:18:56+0000",
          "disciplineId": "autodesk.spec:discipline-2.0.0",
          "applicableUnitIds": null,
          "storageUnitId": null,
          "content": [
              {
                  "id": "item1",
                  "value": 0
              },
              {
                  "id": "item2",
                  "value": 1
              }
          ]
      }
  ]
}
```

Show More

## [Step 6: Update a Spec](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#step-6-update-a-spec)
*   In this example, we will pass the spec ID to update, and the references to the enumeration will be updated to the latest version.
*   This step is critical if there are any updates to the base enumeration’s definition so that changes can propagate to the data types that parameters use.
*   For this example, we are still using the hub ID (`b3aef626-f535-4c7a-a032-c1048416f5ea`).

The following example shows how to update enumerations.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs:batch-update' \
  -X 'PUT' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "specs": [
          {
            "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-1.0.0"
          },
          {
            "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:8bb37d61b3dc489aa94d6bac3d88038c-1.0.0"
          }
        ]
      }'
```

Show More

### Response

```
{
   "results": [
       {
           "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-2.0.0",
           "name": "Single Select: some spec",
           "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-2.0.0",
           "context": "single",
           "createdBy": "FXA2K4JGR5BECGSR",
           "createdAt": "2024-11-11T16:22:31+0000",
           "disciplineId": "autodesk.spec:discipline-2.0.0",
           "applicableUnitIds": null,
           "storageUnitId": null,
           "content": [
               {
                   "id": "item11",
                   "value": 0
               },
               {
                   "id": "item2",
                   "value": 1
               }
           ],
           "previousRevisionId": "parameters.b3aef626f5354c7aa032c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-1.0.0"
       },
       {
           "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:8bb37d61b3dc489aa94d6bac3d88038c-2.0.0",
           "name": "Multiple Select: some spec",
           "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-2.0.0",
           "context": "array",
           "createdBy": "FXA2K4JGR5BECGSR",
           "createdAt": "2024-11-11T16:22:31+0000",
           "disciplineId": "autodesk.spec:discipline-2.0.0",
           "applicableUnitIds": null,
           "storageUnitId": null,
           "content": [
               {
                   "id": "item11",
                   "value": 0
               },
               {
                   "id": "item2",
                   "value": 1
               }
           ],
           "previousRevisionId": "parameters.b3aef626f5354c7aa032c1048416f5ea:8bb37d61b3dc489aa94d6bac3d88038c-1.0.0"
       }
   ]
}
```

Show More

## [Step 7: Create Parameters using new Single Select and Multiple Select Data Types](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#step-7-create-parameters-using-new-single-select-and-multiple-select-data-types)
*   Using the hub ID (`b3aef626-f535-4c7a-a032-c1048416f5ea`), group ID (`b3aef626-f535-4c7a-a032-c1048416f5ea`), and parameter collection ID (`b3aef626-f535-4c7a-a032-c1048416f5ea`), you can create multiple parameters using a user-defined spec to create Single Select and Multiple Select parameters.
*   Single Select Parameters are created when the spec’s context is set to `single` and Multiple Select Parameters are created when the spec’s context is set to `array`.
*   Please note that you can only set id, name, dataTypeId, and readOnly. For the description and metadata, please use the update parameters API to set them.
*   Parameters should be created in your default collection and shared to other collections as needed, in order to match the behavior of the Parameters Service.

The following example shows how to create a couple of parameters.

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/b3aef626-f535-4c7a-a032-c1048416f5ea/groups/b3aef626-f535-4c7a-a032-c1048416f5ea/collections/b3aef626-f535-4c7a-a032-c1048416f5ea/parameters' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '[
        {
          "name": "Single Select Example",
          "dataTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:99002c261ca34d74a66e535788bdb697-1.0.0",
          "readOnly": false
        },
        {
          "name": "Multiple Select Example",
          "dataTypeId": "parameters.0c292c4ef78a4fb49ce3acdd18ac351c:53d4a011541542eca59cbfdc23128dcc-1.0.0",
          "readOnly": false
        }
      ]'
```

Show More

### Response

```
{
  "results": [
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:03573ad417894ad8a21267dd95194145-1.0.0",
          "name": "Single Select Example",
          "specId": "parameters.b3aef626f5354c7aa032c1048416f5ea:99002c261ca34d74a66e535788bdb697-1.0.0",
          "readOnly": false,
          "createdBy": "GUB227BUM233MT5D",
          "createdAt": "2024-11-19T19:35:22+0000",
          "metadata": [
              {
                  "id": "schemaJson",
                  "value": "{\"schemaSpecification\":\"forge-data-schema-2.0.0\",\"schemaType\":\"component\",\"typeid\":\"parameters.0c292c4ef78a4fb49ce3acdd18ac351c:03573ad417894ad8a21267dd95194145-1.0.0\",\"inherits\":[\"autodesk.parameter:parameter-3.0.0\"],\"sealed\":true,\"constants\":[{\"id\":\"name\",\"typeid\":\"String\",\"value\":\"Single Select Example\"}],\"properties\":[{\"id\":\"data\",\"typeid\":\"parameters.0c292c4ef78a4fb49ce3acdd18ac351c:99002c261ca34d74a66e535788bdb697-1.0.0\"}]}"
              },
              {
                  "id": "dependencies",
                  "value": {
                      "parameters.b3aef626f5354c7aa032c1048416f5ea:99002c261ca34d74a66e535788bdb697-1.0.0": "{\"schemaSpecification\":\"forge-data-schema-2.0.0\",\"schemaType\":\"component\",\"typeid\":\"parameters.b3aef626f5354c7aa032c1048416f5ea:99002c261ca34d74a66e535788bdb697-1.0.0\",\"inherits\":[\"autodesk.spec:spec-2.0.0\"],\"sealed\":true,\"constants\":[{\"id\":\"name\",\"typeid\":\"String\",\"value\":\"Single Select: Manual List\"}],\"properties\":[{\"id\":\"value\",\"typeid\":\"parameters.b3aef626f5354c7aa032c1048416f5ea:08027dc5212d43fbae3896f6d9610c0b-1.0.0\"}]}"
                  }
              }
          ]
      },
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:08dfbb6ca98e4216b3dd1b8bc42aad4e-1.0.0",
          "name": "Multiple Select Example",
          "specId": "parameters.b3aef626f5354c7aa032c1048416f5ea:53d4a011541542eca59cbfdc23128dcc-1.0.0",
          "readOnly": false,
          "createdBy": "GUB227BUM233MT5D",
          "createdAt": "2024-11-19T19:42:31+0000",
          "metadata": [
              {
                  "id": "schemaJson",
                  "value": "{\"schemaSpecification\":\"forge-data-schema-2.0.0\",\"schemaType\":\"component\",\"typeid\":\"parameters.b3aef626f5354c7aa032c1048416f5ea:08dfbb6ca98e4216b3dd1b8bc42aad4e-1.0.0\",\"inherits\":[\"autodesk.parameter:parameter-3.0.0\"],\"sealed\":true,\"constants\":[{\"id\":\"name\",\"typeid\":\"String\",\"value\":\"Multiple Select Example\"}],\"properties\":[{\"id\":\"data\",\"typeid\":\"parameters.0c292c4ef78a4fb49ce3acdd18ac351c:53d4a011541542eca59cbfdc23128dcc-1.0.0\"}]}"
              },
              {
                  "id": "dependencies",
                  "value": {
                      "parameters.b3aef626f5354c7aa032c1048416f5ea:53d4a011541542eca59cbfdc23128dcc-1.0.0": "{\"schemaSpecification\":\"forge-data-schema-2.0.0\",\"schemaType\":\"component\",\"typeid\":\"parameters.0c292c4ef78a4fb49ce3acdd18ac351c:53d4a011541542eca59cbfdc23128dcc-1.0.0\",\"inherits\":[\"autodesk.spec:spec-2.0.0\"],\"sealed\":true,\"constants\":[{\"id\":\"name\",\"typeid\":\"String\",\"value\":\"Multiple Select: Long List\"}],\"properties\":[{\"id\":\"value\",\"context\":\"array\",\"typeid\":\"parameters.b3aef626f5354c7aa032c1048416f5ea:1114d23084ed4be1854b5f3b52db0045-1.0.0\"}]}"
                  }
              }
          ]
      }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#)

Review settings

CONTINUE TO SITE

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations#) to learn more about your options. 

YES Decline


---

## API Reference – Parameter Groups


### GET Retrieve Parameters Groups

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

List groups in hub

GET

# v1/accounts/{accountId}/groups

Lists all groups in the specified hub. Note, currently only one group is supported per hub, with a matching group ID to the hub ID. (reserved for future enhancement to support multiple groups.)

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#http-status-code-summary)

200

OK Successful retrieval of all groups within a hub.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#body-structure-200)

 Expand all

pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.
results

array: object
id

string Identifier of the group. It must contain only alphanumeric characters or underscores and must have a length of at least 2 characters and no more than 64 characters.
title

string A human-friendly group title.
description

string A short description of the group.
createdBy

string User that created the group.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone, indicating when the group was created.
updatedBy

string User that last modified the details of the group.
updatedAt

string A Time ISO 8601 Timestamp in UTC Timezone, indicating when the group was modified most recently.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#example)
Successful retrieval of all groups within a hub (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 20,
    "totalResults": 1
  },
  "results": [
    {
      "id": "009777bb-e1e5-4577-9800-0789677e4616",
      "title": "Default Group",
      "description": "Contains collections for this account",
      "createdBy": "GB82ZDWDRBMUV38U",
      "createdAt": "2023-05-13T00:19:40+0000",
      "updatedBy": "4V4WKQJGGQ7N",
      "updatedAt": "2023-10-20T15:36:15+0000"
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET#) to learn more about your options. 

YES Decline


### GET Retrieve a Parameters Group

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Retrieves a group.

GET

# v1/accounts/{accountId}/groups/{groupId}

Returns the details of the specified group, including details of your access level to this group. Note, currently only one group is supported per hub, with a matching group ID to the hub ID. (reserved for future enhancement to support multiple groups.)

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement).

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#http-status-code-summary)

200

OK Successful retrieval of the group’s details.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource. This may occur if fetching a group that the user does not have access to.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#body-structure-200)

 Expand all

id

string The group ID.
title

string The group title.
description

string The group description.
permissions

object Permission level of the user calling this endpoint.
write

boolean User can edit contents.
read

boolean User can view contents.
admin

boolean User can view and change all permissions. Reserved for internal usage.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#example)
Successful retrieval of the group’s details (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "id": "009777bb-e1e5-4577-9800-0789677e4616",
  "title": "Default Group",
  "description": "",
  "permissions": {
    "read": true,
    "write": true,
    "admin": false
  }
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#)

Review settings

CONTINUE TO SITE

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET#) to learn more about your options. 

YES Decline


### PUT Update a Parameters Group

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Update group

PUT

# v1/accounts/{accountId}/groups/{groupId}

Update the details of an existing group. The title cannot be empty or null. Note, currently only one group is supported per hub, with a matching group ID to the hub ID. (reserved for future enhancement to support multiple groups.)

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#resource-information)

Method and URI PUT

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}
Authentication Context user context required
Required OAuth Scopes`data:write`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement)

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#body-structure)

title*

string A title or name for the group.
description*

string A description of the group. Maximum length is 256 characters.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#http-status-code-summary)

200

OK Successfully updated group details
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#body-structure-200)

id

string The collection ID.
title

string The collection title.
description

string The collection description.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#example)
Successfully Updated a Group (200)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/02826a53-ec13-4b0c-980ab-84af7a91214' \
  -X 'PUT' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "title": "Account Group 2",
        "description": "An edited Group"
      }'
```

Show More

### Response

```
{
  "id": "02826a53-ec13-4b0c-980ab-84af7a91214",
  "title": "Account Group 2",
  "description": "An edited Group"
}
```

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT#) to learn more about your options. 

YES Decline


---

## API Reference – Parameter Collections


### POST Create the Parameters Collection

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Creates a new parameter collection.

POST

# v1/accounts/{accountId}/groups/{groupId}/collections

Creates a new collection for associating with parameters.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections
Authentication Context user context required
Required OAuth Scopes`data:create``data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#headers)

Authorization*

string Must be `Bearer <token>`, where `<token>` is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement.)

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#body-structure)
The data for creating a new parameter collection

collectionId

string ID of the collection. It is optional, and will generate a new UUID if omitted, by default.
title

string The collection title.
description

string The collection description.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#http-status-code-summary)

201

Created Successfully created the new collection
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
409

Conflict The request could not be completed due to a conflict with the current state of the target resource. May occur when Parameter collection with id/title provided already exists in this hub/group
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (201)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#body-structure-201)

collectionId

string ID of the collection.
title

string The collection title.
description

string The collection description.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#example)
Successfully Created a Collection (201)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "title": "Cool Parameter Collection",
        "description": "My parameters for Cool Project 1"
      }'
```

Show More

### Response

```
{
  "collectionId": "a9974bd0-546d-4cba-a434-cdea5fb70bf8",
  "title": "Cool Parameter Collection",
  "description": "My parameters for Cool Project 1"
}
```

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST#) to learn more about your options. 

YES Decline

[Privacy settings](javascript:;)


### GET Retrieve Parameter Collections

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

List parameter collections in the given group

GET

# v1/accounts/{accountId}/groups/{groupId}/collections

Lists all parameter collections in the specified group.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Accept-Language

string A localization list consisting of localization codes delimited by commas. For instance, a user residing in the UK may request `en-GB`, `en-US`, or `en`.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement).

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#query-string-parameters)

offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
joinConstructionData

bool When set to true, populates response field “isArchived” to indicate whether each collection in the Autodesk Forma hub’s Library is archived. Otherwise, the “isArchived” field will be null for all collections.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#http-status-code-summary)

200

OK Successful retrieval of all parameter collections within a group.
207

Partial Success The best-case scenario for localization cannot be returned, but otherwise at least one parameter collection was localized in some way. The “best case” is when the first choice localization code could be used on all the parameter collections.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it. If the hub is not yet activated there will be an “Account is not activated” message. See [Step-by-Step tutorials](https://aps.autodesk.com/en/docs/parameters/v1/reference/tutorials/getting-started/) for how to activate your hub
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#body-structure-200)## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#example)
Successful retrieval of all parameter collections within a group (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 20,
    "totalResults": 1
  },
  "results": [
    {
          "id": "36416b47-4478-4c58-9a13-a924169a9813",
          "title": "A Test Collection",
          "description": "A Collection for testing parameter management",
          "group": {"id": "009777bb-e1e5-4577-9800-0789677e4616" },
          "account": {"id": "009777bb-e1e5-4577-9800-0789677e4616" },
          "createdBy": "KK7SLSD6ZBFP",
          "createdAt": "2023-07-10T18:11:15+0000",
          "updatedBy": "KK7SLSD6ZBFP",
          "updatedAt": "2023-07-10T18:11:15+0000",
          "isArchived": "null"
      }
  ]
}
```

Show More

Successful retrieval of all parameter collections within a group in generic German (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Accept-Language: de'
```

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 20,
    "totalResults": 1
  },
  "results": [
    {
      "id": "36416b47-4478-4c58-9a13-a924169a9813",
      "title": "Eine Testsammlung",
      "description": "Eine Sammlung zum Testen des Parametermanagements",
      "group": {
        "id": "009777bb-e1e5-4577-9800-0789677e4616"
      },
      "account": {
        "id": "009777bb-e1e5-4577-9800-0789677e4616"
      },
      "createdBy": "KK7SLSD6ZBFP",
      "createdAt": "2023-07-10T18:11:15+0000",
      "updatedBy": "KK7SLSD6ZBFP",
      "updatedAt": "2023-07-10T18:11:15+0000",
      "localization": {
        "locale": {
          "language": "de",
          "region": null
        },
        "selection": "LCL_EXACT"
      }
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#)

Review settings

CONTINUE TO SITE

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET#) to learn more about your options. 

YES Decline


### GET Retrieve a Parameter Collection

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Get a parameter collection

GET

# v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}

Get the details of a parameter collection.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Accept-Language

string A localization list consisting of localization codes delimited by commas. For instance, a user residing in the UK may request `en-GB`, `en-US`, or `en`.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement).
collectionId

string The collection ID.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#http-status-code-summary)

200

OK Successful retrieval of the parameter collection’s details.
207

Partial Success The best-case scenario for localization cannot be returned, but otherwise the parameter collection indicated was localized in some way. The “best case” is when the first choice localization code could be used on the parameter indicated.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it. If the hub is not yet activated there will be a “Account is not activated” message. See [Step-by-Step tutorials](https://aps.autodesk.com/en/docs/parameters/v1/reference/tutorials/getting-started/) for how to activate your hub.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#body-structure-200)

 Expand all

id

string The collection ID.
title

string The collection title.
description

string The collection description.
permissions

object Permissions of the caller of this API for this Collection.
write

boolean User can edit contents.
read

boolean User can view contents.
admin

boolean User can view and change all permissions. Reserved for internal usage.
localization

object An object recording information about how this data was localized. If this property is undefined, then no localization attempt was made and the information is presented in its storage form.
locale

object The localization tags of this parameter data as it was returned. If the value of selection is “LCL_MISSING” then locale is null.
language

string The ISO-439 language code.
region

string The ISO-3166-1 2 letter region code or UN M.49 three digit region code. If no region was specified in the source localization, then the value is null.
selection

enum How the localization was chosen. Any of: “LCL_EXACT”: The first choice exact localization requested was available. “LCL_FALLBACK”: A fallback scheme controlled by the provided localization list was used but the first choice localization was not used. “LCL_MISSING”: There was no localization available that fulfilled the localization list.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#example)
Successful retrieval of the parameter collection’s details (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/02826a53-ec13-4b0c-980ab-84af7a91214' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "id": "02826a53ec-134b-0c98-0ab8-4af7a91214",
  "title": "Education Project Collection",
  "description": "Contains parameters for all education projects",
  "permissions": {
    "read": true,
    "write": false,
    "admin": false
  }
}
```

Show More

Successful retrieval of the parameter collection’s details in generic German (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/02826a53-ec13-4b0c-980ab-84af7a91214' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Accept-Language: de'
```

### Response

```
{
  "id": "02826a53ec-134b-0c98-0ab8-4af7a91214",
  "title": "Sammlung Bildungsprojekte",
  "description": "Enthält Parameter für alle Bildungsprojekte",
  "permissions": {
    "read": true,
    "write": false,
    "admin": false
  },
  "localization": {
    "locale": {
      "language": "de",
      "region": null
    },
    "selection": "LCL_EXACT"
  }
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET#) to learn more about your options. 

YES Decline


### PUT Update a Parameter Collection

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Update collection details

PUT

# v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}

Update the details of an existing parameter collection. The title cannot be empty or null.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#resource-information)

Method and URI PUT

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}
Authentication Context user context required
Required OAuth Scopes`data:write`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement)
collectionId

string The collection ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#body-structure)

title*

string A human-friendly title for the collection. Must be 1-64 characters long.
description*

string A short description of the collection. Maximum length is 256 characters.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#http-status-code-summary)

200

OK Successfully updated collection details.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#body-structure-200)

id

string The collection ID.
title

string The collection title.
description

string The collection description.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#example)
Successfully Updated a Collection (200)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/02826a53-ec13-4b0c-980ab-84af7a91214' \
  -X 'PUT' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "title": "My Cool Parameters",
        "description": "Collection for my cool parameters"
      }'
```

Show More

### Response

```
{
  "id": "02826a53-ec13-4b0c-980ab-84af7a91214",
  "title": "Education Project Collection",
  "description": "Contains parameters for all education projects"
}
```

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT#) to learn more about your options. 

YES Decline


---

## API Reference – Parameters


### GET Retrieve parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Lists parameters in a parameter collection.

GET

# v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters

Lists parameters in a parameter collection. Optionally, attempt to localize that information according to a given localization fallback list.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Accept-Language

string A localization list consisting of localization codes delimited by commas. For instance, a user residing in the UK may request `en-GB`, `en-US`, or `en`.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement).
collectionId

string The collection ID.

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#query-string-parameters)

offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
ids

string The parameter IDs split by comma. With this query parameter, you can get the specified parameters in an array.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#http-status-code-summary)

200

OK Successful retrieval of the parameters within the designated collection.
207

Multi-Status The best-case scenario for localization cannot be returned, but otherwise the parameters were localized in some way. The “best case” is when the first choice localization code could be used on the parameters indicated.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#body-structure-200)

 Expand all

id

string The parameter ID.
name

string The parameter name.
description

string The parameter description.
specId

string The parameter spec ID. See the [field guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec/) about the definition of spec.”
valueTypeId

string The identifier of the storage value type, which could be a primitive type ID, such as Bool, Int64, Float64, String, DateTime, URI, Date, or a complex type ID.
readOnly

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set.
metadata

array: object The parameter metadata. This is a collection of metadata objects that provide additional information about the parameter. Refer to the table, below for details on the meaning for each metadata object. Returned metadata may vary from one parameter to another. For example, to support the use of a parameter in Revit, the metadata object might record category bindings and an instance/type assignment.
id

string The metadata ID.
value

varies The metadata value. This can be of type Boolean, string, object, array of strings, array of objects, or null.
createdBy

string User that created the parameter.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the parameter was created.
localization

object An object recording information about how this data was localized. If this property is undefined, then no localization attempt was made and the information is presented in its storage form.
origin

object Information about what instance of the resource the localization was based on.
version

string The version of the source data the localization is based on.
locale

object The localization tags of this parameter data as it was returned. If the value of selection is “LCL_MISSING” then locale is null.
language

string The ISO-439 language code.
region

string The ISO-3166-1 2 letter region code or UN M.49 three digit region code. If no region was specified in the source localization, then the value is null.
selection

enum How the localization was chosen. Any of:“LCL_EXACT”: The first choice exact localization requested was available. “LCL_FALLBACK”: A fallback scheme controlled by the provided localization list and requested version was used but the first choice localization was not used. “LCL_MISSING”: There was no localization available that fulfilled the localization list.

## [Metadata Fields](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#metadata-fields)
These fields may be present in the `metadata` array. Many represent Autodesk internal controls for application behavior, but are documented here for completeness.

 Expand all

isHidden

boolean Indicates if the parameter is hidden or not in a UI client.
isArchived

boolean Indicates if the parameter is archived or not.
instanceTypeAssociation

string Indicates if the parameter is associated with element instances, element types, or neither. Possible values: `NONE`, `INSTANCE`, `TYPE`
labelIds

array: string List of all the labels attached to this parameter.
group

object Identifies a Properties Palette group into which the parameter may be sorted.
bindingId

string The ID of the group binding. It can be looked up in the results of the GET /classifications/groups API.
id

string The group identifier.
categories

array: object Categories of Revit elements to which the parameter may be attached.
bindingId

string The category binding ID. It can be looked up in the results of the GET /classifications/categories API.
id

string The category identifier.
specCategoryId

string For a Family Type parameter, this field identifies the Revit element category which constrains its value.
pimPropBehavior

string Controls Autodesk internal operations. May have a value such as `DEFAULT`, `DYNAMIC_WITH_CARRY_FORWARD`, `DYNAMIC`, or `TIMELESS`.
pimPropDMBehavior

string Controls Autodesk internal operations. May have a value such as `SHOULD_COPY`.
pimPropCategory

string Controls Autodesk internal operations. May have a value such as `COMPONENT`, `DRAWING`, or `MODEL`.
pimDisplayInSummary

boolean Controls Autodesk internal operations.
pimIsSearchable

boolean Controls Autodesk internal operations.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#example)
Successful retrieval of the parameters (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/e284ed9a-df49-4d4f-80bc-cd4de91db4cb/parameters' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "pagination": {
    "limit": 50,
    "offset": 0,
    "totalResults": 1
  },
  "results": [
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:a3ec4719e06743ef8e2f62228c631b17-1.0.0",
      "name": "Hidden2",
      "readOnly": false,
      "description": null,
      "specId": "autodesk.spec.aec:length-2.0.0",
      "metadata": [
        {
          "id": "isArchived",
          "value": false
        },
        {
          "id": "isHidden",
          "value": false
        },
        {
          "id": "labelIds",
          "value": [
            "ACRD-00685-EFPT-41973"
          ]
        },
        {
          "id": "instanceTypeAssociation",
          "value": "NONE"
        },
        {
          "id": "categories",
          "value": [
            {
              "bindingId": "ACFT-94206-BGDE-78534",
              "typeId": "autodesk.revit.category.family:abutmentFoundations-1.0.0"
            }
          ]
        },
        {
          "id": "group",
          "value": null
        }
      ],
      "createdBy": "JFGVKSJ7FF9M",
      "createdAt": "2022-06-28T01:50:43.000Z"
    }
  ]
}
```

Show More

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/e284ed9a-df49-4d4f-80bc-cd4de91db4cb/parameters' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Accept-Language: de'
```

### Response

```
{
  "pagination": {
    "limit": 50,
    "offset": 0,
    "totalResults": 1
  },
  "results": [
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:a3ec4719e06743ef8e2f62228c631b17-1.0.0",
      "name": "Versteckt2",
      "readOnly": false,
      "description": null,
      "specId": "autodesk.spec.aec:length-2.0.0",
      "metadata": [
        {
          "id": "isArchived",
          "value": false
        },
        {
          "id": "isHidden",
          "value": false
        },
        {
          "id": "labelIds",
          "value": [
            "ACRD-00685-EFPT-41973"
          ]
        },
        {
          "id": "instanceTypeAssociation",
          "value": "NONE"
        },
        {
          "id": "categories",
          "value": [
            {
              "bindingId": "ACFT-94206-BGDE-78534",
              "typeId": "autodesk.revit.category.family:abutmentFoundations-1.0.0"
            }
          ]
        },
        {
          "id": "isHidden",
          "value": false
        },
        {
          "id": "instanceTypeAssociation",
          "value": "TYPE"
        }
      ],
      "createdBy": "JFGVKSJ7FF9M",
      "createdAt": "2022-06-28T01:50:43.000Z",
      "localization": {
        "origin": {
          "version": "1.0.0"
        },
        "locale": {
          "language": "de",
          "region": null
        },
        "selection": "LCL_EXACT"
      }
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET#) to learn more about your options. 

YES Decline


### GET Retrieve a parameter

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Gets a parameter definition.

GET

# v1/parameters/{parameterId}

Gets a parameter definition. Optionally, attempt to localize that information according to a given localization fallback list.

For this endpoint, the user (authorization token) does not need access to a given hub.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/parameters/{parameterId}
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Accept-Language

string A localization list consisting of localization codes delimited by commas. For instance, a user residing in the UK may request `en-GB`, `en-US`, or `en`.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#uri-parameters)

parameterId

string The parameter ID.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#http-status-code-summary)

200

OK Successful retrieval of the parameter information.
207

Multi-Status The best-case scenario for localization cannot be returned, but otherwise the parameter indicated was localized in some way. The “best case” is when the first choice localization code could be used on the parameter indicated.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#body-structure-200)

id

string The parameter ID.
name

string The parameter name.
specId

string The parameter spec ID. Look up detailed information in the response of the GET /specs API.
readOnly

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set.

 Expand all

id

string The parameter ID.
name

string The parameter’s possibly localized name.
description

string The parameter’s possibly localized description. May be empty.
specId

string The parameter spec ID. See the field guide about the definition of spec.
readOnly

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set.
localization

object An object recording information about how this data was localized. If this property is undefined, then no localization attempt was made and the information is presented in its storage form.
origin

object Information about what instance of the resource the localization was based on.
version

string The version of the source data the localization is based on.
locale

object The localization tags of this parameter data as it was returned. If the value of selection is “LCL_MISSING” then locale is null.
language

string The ISO-439 language code.
region

string The ISO-3166-1 2 letter region code or UN M.49 three digit region code. If no region was specified in the source localization, then the value is null.
selection

enum How the localization was chosen. Any of:“LCL_EXACT”: The first choice exact localization requested was available. “LCL_FALLBACK”: A fallback scheme controlled by the provided localization list and requested version was used but the first choice localization was not used. “LCL_MISSING”: There was no localization available that fulfilled the localization list.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#example)
Successful retrieval of the parameter definition (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/parameters/parameters.a5c6d0e9593b462c8a9c022269adaf48:a3ec4719e06743ef8e2f62228c631b17-1.0.0' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "id": "parameters.a5c6d0e9593b462c8a9c022269adaf48:a3ec4719e06743ef8e2f62228c631b17-1.0.0",
  "name": "window width",
  "specId": "autodesk.spec.aec:length-2.0.0",
  "readOnly": true
}
```

Successful retrieval of the parameter definition in generic German (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/parameters/parameters.a5c6d0e9593b462c8a9c022269adaf48:a3ec4719e06743ef8e2f62228c631b17-1.0.0' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Accept-Language: de'
```

### Response

```
{
  "id": "parameters.a5c6d0e9593b462c8a9c022269adaf48:a3ec4719e06743ef8e2f62228c631b17-1.0.0",
  "name": "Fensterbreite",
  "description": "Die Breitenmessung des Fensters",
  "specId": "autodesk.spec.aec:length-2.0.0",
  "readOnly": true,
  "localization": {
    "origin": {
      "version": "1.0.0"
    },
    "locale": {
      "language": "de",
      "region": null
    },
    "selection": "LCL_EXACT"
  }
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET#) to learn more about your options. 

YES Decline


### POST Create parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Creates new parameters.

POST

# v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters

Creates new parameters definitions. Definition data is immutable, and it includes `id`, `name`, `dataTypeId` and `readOnly`. The maximum number per request is 50. For setting description and metadata, use [the update parameters API](https://aps.autodesk.com/en/docs/parameters/v1/reference/parameters-updateparameters-PATCH/) to set them. Parameters should be created in your default collection and shared to other collections as needed, in order to match the behavior of the Parameters Service.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters
Authentication Context user context required
Required OAuth Scopes`data:create`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement).
collectionId

string The collection ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#body-structure)
Object:Array

id

string(optional) The parameter ID. If specified, it must be a UUID without hyphens. If omitted, the system will automatically generate a new UUID without hyphens.
name*

string The parameter name. The length of the parameter name is limited to 255 characters. A parameter name can’t be a restricted word: `mm cm m km log sqrt sin cos tan asin acos atan exp abs pi round roundup rounddn` A parameter name can’t contain any of these prohibited symbol(s): \ : { } [ ]`
dataTypeId*

string The parameter data type ID. It could be either a parameter spec ID or a category ID. When used as a “data type” identifier, a category ID indicates the “Family Type” spec with that category. Lookup the spec ID in the response of the [GET /specs](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET/) Endpoint. Lookup the category ID in the response of the [GET /classifications/categories](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET/) Endpoint. For more information about spec and category, pleas refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide).
readOnly*

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#http-status-code-summary)

201

Created Successfully created the parameters.
207

Partial Success Successfully created some of the parameters, with errors for some parameters in the batch.
400

Bad Request The request could not be understood by the server due to malformed syntax. This may occur when parameter validation fails, such as when the parameter name is too long or contains prohibited symbols. The response should include what validation rule was violated.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (201)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#body-structure-201)

 Expand all

results

array: object The parameter creation results.
id

string The parameter ID.
name

string The parameter name.
specId

string The parameter spec ID.
readOnly

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set.
createdBy

string User that created the parameter.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the parameter was created.

## [Body Structure (207)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#body-structure-207)

 Expand all

results

array: object The parameter creation results.
id

string The parameter ID.
name

string The parameter name.
specId

string The parameter spec ID.
readOnly

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set.
createdBy

string User that created the parameter.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the parameter was created.
errors

array: object The errors.
id

string The resource ID.
title

string The error title.
detail

string The error detail.
code

string The error code.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#example)
Successfully Created Parameter(s) (201)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/a9974bd0-546d-4cba-a434-cdea5fb70bf8/parameters' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '[
        {
          "name": "window width",
          "dataTypeId": "autodesk.spec.aec:length-2.0.0",
          "readOnly": true
        },
        {
          "name": "window length",
          "dataTypeId": "autodesk.spec.aec:length-2.0.0",
          "readOnly": true
        }
      ]'
```

Show More

### Response

```
{
  "results": [
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:9fa3644ac1984fca987fe1d5dc701120-1.0.0",
      "name": "window width",
      "specId": "autodesk.spec.aec:length-2.0.0",
      "readOnly": true,
      "createdBy": "200809200167579",
      "createdAt": "2023-10-03T22:29:43+0000"
    },
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:885621e67e7f4e49b9754b657ea476dc-1.0.0",
      "name": "window length",
      "specId": "autodesk.spec.aec:length-2.0.0",
      "readOnly": true,
      "createdBy": "200809200167579",
      "createdAt": "2023-10-03T22:29:43+0000"
    }
  ]
}
```

Show More

Partial Success Creating Parameters (207)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/a9974bd0-546d-4cba-a434-cdea5fb70bf8/parameters' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '[
        {
          "name": "window width",
          "dataTypeId": "autodesk.spec.aec:length-2.0.0",
          "readOnly": true
        },
        {
          "id": "00016da1684048688663e3cbf876bfea",
          "name": "window length",
          "dataTypeId": "autodesk.spec.aec:length-2.0.0",
          "readOnly": true
        }
      ]'
```

Show More

### Response

```
{
    "results": [
        {
            "id": "parameters.3141915a7869420d80958d16d4756946:5abbf49c15bc450ea65a97d34a31fe49-1.0.0",
            "name": "one param",
            "specId": "autodesk.spec:spec.int64-2.0.0",
            "readOnly": false,
            "createdBy": "YZVYJQWWAJ89",
            "createdAt": "2023-11-08T22:03:18+0000"
        }
    ],
    "errors": [
        {
            "id": "parameters.3141915a7869420d80958d16d4756946:00016da1684048688663e3cbf876bfea-1.0.0",
            "code": "PARAMETER-DUPLICATED-PARAMETER",
            "title": "Duplicated parameter",
            "detail": "The parameter with the given ID already exists"
        }
    ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST#) to learn more about your options. 

YES Decline


### PATCH Modify parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Updates parameters.

PATCH

# v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters

Updates a list of parameters (maximum amount per request is 10) with the given properties, including description and the metadata with isHidden, revitCategoryBindingIds, instanceTypeAssociation and labelIds.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#resource-information)

Method and URI PATCH

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters
Authentication Context user context required
Required OAuth Scopes`data:read data:write`
Data Format JSON

Note: Data will be updated according to the JSON Merge Patch protocol.

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement)
collectionId

string The collection ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#body-structure)
Object:Array

 Expand all

id*

string The parameter ID.
description

string The parameter description. The length of the parameter description is limited to 250 characters.
metadata

array: object The parameter metadata. It may vary from one product to another. For example, to support the use of a parameter in Revit, the metadata object might record category bindings and an instance/type assignment.
id

string The metadata ID. It could be `isHidden`, `isArchived`, `instanceTypeAssociation`, `labelIds`, `categoryBindingIds`, `groupBindingId`.
value

one of The metadata value.
0

boolean When the ID is `isHidden`, this value indicates if the parameter is hidden or not in the application.

When the ID is `isArchived`, this value indicates if the parameter is archived or not.
1

string When the ID is `instanceTypeAssociation`, the value is an enumerated string value to indicate if the parameter is associated with element instances, element types, or neither.

Possible values: `NONE`, `INSTANCE`, `TYPE`

When the ID is `groupBindingId`, the value is the group Binding ID, which can be looked up in the results of the `GET /classifications/groups?filter[bindable]=true` API.
2

array: string When the ID is `categoryBindingIds`, the value is the category Binding IDs, which can be looked up in the results of the `GET /classifications/categories?filter[bindable]=true` API.

When the ID is `labelIds`, the value is the label IDs, which can be looked up in the results of the `GET /accounts/:accountId/labels` API.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#http-status-code-summary)

200

OK Successfully updated the given parameters.
207

Partial Success Successfully updated some parameters, with errors for some parameters in the batch.
400

Bad Request The request could not be understood by the server due to malformed syntax. This may occur when parameter validation fails, such as when the parameter name is too long or contains prohibited symbols. The response should include what validation rule was violated.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

Successfully Updated Parameters (200)

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#body-structure-200)

 Expand all

results

array: object
id

string The parameter ID.
description

string The parameter description. The length of the parameter description is limited to 250 characters.
metadata

array: object The parameter metadata. It may vary from one product to another.

For example, to support the use of a parameter in Revit, the metadata object might record category bindings and an instance/type assignment.
anyOf
0

object An object with a string ID and a Boolean value. The ID could be one of the below:

“isHidden” to indicate if the parameter is hidden or not in the application.

“isArchived” to indicate if the parameter is archived or not.
id

string The metadata ID.
value

boolean Boolean value of the metadata.
1

object An object with a string ID and an enumerated string value. The ID could be “instanceTypeAssociation” to indicate if the parameter is associated with element instances, element types, or neither. Possible values: `NONE`, `INSTANCE`, `TYPE`
id

string The metadata ID.
value

string The metadata value.
2

object An object with a string ID and a string array value. The ID could be “labelIds” to list all the labels attached to this parameter.
id

string The metadata ID.
value

array: string The metadata value.
3

object An object with a string ID and an object value. The ID could be “group” to indicate the group for this parameter.
id

string The metadata ID.
value

object The metadata value.
bindingId

string The binding ID of the group, which can be looked up in the results of the GET /classifications/groups API.
id

string The group ID, which can be looked up in the results of the GET /classifications/groups API.
4

object An object with a string ID and an object value. The ID could be “categories” to indicate the categories of this parameter.
id

string The metadata ID.
value

array: object The metadata value.
bindingId

string The category binding ID, which can be looked up in the results of the GET /classifications/categories API.
id

string The category ID, which can be looked up in the results of the GET /classifications/categories API.
5

object An object with a string ID and a string value. The ID could be “specCategoryId” to indicate the spec category ID of this family type parameter.
id

string The metadata ID.
value

string The metadata value.
createdBy

string User that created the parameter.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the parameter was created.

Note: Responses may include pimPropBehavior and pimPropDMBehavior for each parameter. This is for internal use only.

Partial Success Updating Parameters (207)

## [Body Structure (207)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#body-structure-207)

 Expand all

results

array: object
id

string The parameter ID.
description

string The parameter description. The length of the parameter description is limited to 250 characters.
metadata

array: object The parameter metadata. It may vary from one product to another.

For example, to support the use of a parameter in Revit, the metadata object might record category bindings and an instance/type assignment.
anyOf
0

object An object with a string ID and a Boolean value. The ID could be one of the below:

“isHidden” to indicate if the parameter is hidden or not in the application.

“isArchived” to indicate if the parameter is archived or not.
id

string The metadata ID.
value

boolean Boolean value of the metadata.
1

object An object with a string ID and an enumerated string value. The ID could be “instanceTypeAssociation” to indicate if the parameter is associated with element instances, element types, or neither. Possible values: `NONE`, `INSTANCE`, `TYPE`
id

string The metadata ID.
value

string The metadata value.
2

object An object with a string ID and a string array value. The ID could be “labelIds” to list all the labels attached to this parameter.
id

string The metadata ID.
value

array: string The metadata value.
3

object An object with a string ID and an object value. The ID could be “group” to indicate the group for this parameter.
id

string The metadata ID.
value

object The metadata value.
bindingId

string The binding ID of the group, which can be looked up in the results of the GET /classifications/groups API.
id

string The group ID, which can be looked up in the results of the GET /classifications/groups API.
4

object An object with a string ID and an object value. The ID could be “categories” to indicate the categories of this parameter.
id

string The metadata ID.
value

array: object The metadata value.
bindingId

string The category binding ID, which can be looked up in the results of the GET /classifications/categories API.
id

string The category ID, which can be looked up in the results of the GET /classifications/categories API.
5

object An object with a string ID and a string value. The ID could be “specCategoryId” to indicate the spec category ID of this family type parameter.
id

string The metadata ID.
value

string The metadata value.
createdBy

string User that created the parameter.
createdAt

string A TimeISO 8601 Timestamp in UTC Timezone indicating when the parameter was created.
errors

array: object
id

string The resource ID.
title

string The error title.
detail

string The error detail.
code

string The error code.

Note: Responses may include pimPropBehavior and pimPropDMBehavior for each parameter. This is for internal use only.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#example)
Successfully Updated Parameters (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/a9974bd0-546d-4cba-a434-cdea5fb70bf8/parameters' \
  -X 'PATCH' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '[
        {
          "id": "parameters.009777bbe1e5457798000789677e4616:9fa3644ac1984fca987fe1d5dc701120-1.0.0",
          "description": "The width of a window",
          "metadata": [
              {
                  "id": "instanceTypeAssociation",
                  "value": "INSTANCE"
              },
              {
                  "id": "labelIds",
                  "value": [
                      "ACVA-80318-CKKJ-05645"
                  ]
              },
              {
                  "id": "categoryBindingIds",
                  "value": [
                      "ACFV-53198-BRVZ-83753"
                  ]
              }
          ]
        },
        {
          "id": "parameters.009777bbe1e5457798000789677e4616:885621e67e7f4e49b9754b657ea476dc-1.0.0",
          "description": "the length of an entire window when several are combined",
          "metadata": [
            {
              "id": "isHidden",
              "value": true
            }
          ]
        }
      ]'
```

Show More

### Response

```
{
  "results": [
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:9fa3644ac1984fca987fe1d5dc701120-1.0.0",
      "name": "window width",
      "description": "The width of a window",
      "specId": "autodesk.spec.aec:length-2.0.0",
      "readOnly": false,
      "metadata": [
          {
              "id": "isHidden",
              "value": false
          },
          {
              "id": "isArchived",
              "value": false
          },
          {
              "id": "instanceTypeAssociation",
              "value": "INSTANCE"
          },
          {
              "id": "categories",
              "value": [
                  {
                      "bindingId": "ACFV-53198-BRVZ-83753",
                      "id": "autodesk.revit.category.family:abutmentFoundations-1.0.0"
                  }
              ]
          },
          {
              "id": "labelIds",
              "value": [
                  "ACVA-80318-CKKJ-05645"
              ]
          },
          {
              "id": "group",
              "value": null
          },
          {
              "id": "pimPropBehavior",
              "value": null
          },
          {
              "id": "pimPropDMBehavior",
              "value": null
          }
      ],
      "createdBy": "200809200167579",
      "createdAt": "2022-10-18T17:16:05+0000"
    },
    {
      "id": "parameters.009777bbe1e5457798000789677e4616:885621e67e7f4e49b9754b657ea476dc-1.0.0",
      "name": "window length",
      "description": "the length of an entire window when several are combined",
      "specId": "autodesk.spec.aec:length-2.0.0",
      "readOnly": false,
      "metadata": [
          {
              "id": "isHidden",
              "value": true
          },
          {
              "id": "isArchived",
              "value": false
          },
          {
              "id": "instanceTypeAssociation",
              "value": "INSTANCE"
          },
          {
              "id": "categories",
              "value": [
                  {
                      "bindingId": "ACFV-53198-BRVZ-83753",
                      "id": "autodesk.revit.category.family:windows-1.0.0"
                  }
              ]
          },
          {
              "id": "labelIds",
              "value": [
                  "ACVA-80318-CKKJ-05645"
              ]
          },
          {
              "id": "group",
              "value": null
          },
          {
              "id": "pimPropBehavior",
              "value": null
          },
          {
              "id": "pimPropDMBehavior",
              "value": null
          }
      ],
      "createdBy": "200809200167579",
      "createdAt": "2022-10-18T17:16:05+0000"
    }
  ]
}
```

Show More

Partial Success Updating Parameters (207).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/a9974bd0-546d-4cba-a434-cdea5fb70bf8/parameters' \
  -X 'PATCH' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '[
        {
          "id": "parameters.009777bbe1e5457798000789677e4616:9fa3644ac1984fca987fe1d5dc701120-1.0.0",
          "description": "The width of a window",
          "metadata": [
              {
                  "id": "instanceTypeAssociation",
                  "value": "INSTANCE"
              },
              {
                  "id": "labelIds",
                  "value": [
                      "ACVA-80318-CKKJ-05645"
                  ]
              },
              {
                  "id": "categoryBindingIds",
                  "value": [
                      "ACFV-53198-BRVZ-83753"
                  ]
              }
          ]
        },
        {
          "id": "parameters.009777bbe1e5457798000789677e4616:885621e67e7f4e49b9754b657ea476dc-1.0.0",
          "description": "the length of an entire window when several are combined",
          "metadata": [
            {
              "id": "isHidden",
              "value": true
            }
          ]
        }
      ]'
```

Show More

### Response

```
{
    "results": [
        {
            "id": "parameters.3141915a7869420d80958d16d4756946:00016da1684048688663e3cbf876bfea-1.0.0",
            "name": "S Video_shw",
            "description": "good one",
            "specId": "autodesk.spec:spec.int64-2.0.0",
            "readOnly": false,
            "metadata": [
                {
                    "id": "isHidden",
                    "value": true
                },
                {
                    "id": "isArchived",
                    "value": true
                },
                {
                    "id": "instanceTypeAssociation",
                    "value": "NONE"
                },
                {
                    "id": "categories",
                    "value": [
                        {
                            "bindingId": "ACFT-94206-BGDE-78534",
                            "id": "autodesk.revit.category.family:abutmentFoundations-1.0.0"
                        }
                    ]
                },
                {
                    "id": "labelIds",
                    "value": [
                        "ACYF-88321-BMDM-59319"
                    ]
                },
                {
                    "id": "group",
                    "value": null
                },
                {
                    "id": "pimPropBehavior",
                    "value": "TIMELESS"
                },
                {
                    "id": "pimPropDMBehavior",
                    "value": null
                }
            ],
            "createdBy": "VW9JXYURN8WQKYYU",
            "createdAt": "2022-12-12T16:19:25+0000"
        }
    ],
    "errors": [
        {
            "id": "parameters.3141915a7869420d80958d16d4756946:00016da1684048688663e3cbf876bfec-1.0.0",
            "code": "PARAMETER-NOT-FOUND",
            "title": "Parameter not found",
            "detail": "The parameter with the given ID does not exist"
        }
    ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH#) to learn more about your options. 

YES Decline


### POST Render parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Renders parameters for display.

POST

# v1/parameters:render

Renders the parameters from the source unit or symbol to the target unit or symbol with the number format and precision. The maximum number of parameters per chunk is 50.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/parameters:render
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#body-structure)
Object:Array

sourceParameterValue*

number The parameter value of the source unit or symbol.
sourceUnitOrSymbolId*

string The source unit or symbol ID. Look up detailed information in the response of the GET /units API.
targetUnitOrSymbolId*

string The target unit or symbol ID. Look up detailed information in the response of the GET /units API. There will be no symbol in the target value string if this value is set to a unit.
numberFormat

string The number format of the target parameter value string. It is optional and the value could be `FIXED_POINT` or `FRACTION`. The default value is `FIXED_POINT`.
precision

int The precision of the target parameter value string. It is optional and the default value is 4. Number from 0 to 12 indicating how many decimal places to render. Or from 0 to 9 indicating how precisely to round the fraction.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#http-status-code-summary)

200

OK Successful retrieval of the rendered parameters.
207

Partial Success Partially successful retrieval of the rendered parameters.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#body-structure-200)

 Expand all

results

array: object The parameters render results.
sourceParameterValue

number The parameter value of the source unit or symbol.
sourceUnitOrSymbolId

string The source unit or symbol Id. Look up detailed information in the response of the GET /units API.
targetUnitOrSymbolId

string The target unit or symbol Id. Look up detailed information in the response of the GET /units API.
numberFormat

string The number format of the target parameter value string.
precision

int The precision of the target parameter value string.
targetParameterValue

number The parameter value of the target unit or symbol.
targetParameterValueString

string The parameter value string of the target unit or symbol with the number format and precision.

## [Body Structure (207)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#body-structure-207)

 Expand all

results

array: object The parameters render results.
sourceParameterValue

number The parameter value of the source unit or symbol.
sourceUnitOrSymbolId

string The source unit or symbol Id.
targetUnitOrSymbolId

string The target unit or symbol Id. Look up detailed information in the response of the GET /units API.
numberFormat

string The number format of the target parameter value string.
precision

int The precision of the target parameter value string.
targetParameterValue

number The parameter value of the target unit or symbol.
targetParameterValueString

string The parameter value string of the target unit or symbol with the number format and precision.
errors

array: object The errors.
sourceParameterValue

number The parameter value of the source unit or symbol.
sourceUnitOrSymbolId

string The source unit or symbol Id.
targetUnitOrSymbolId

string The target unit or symbol Id. Look up detailed information in the response of the GET /units API.
numberFormat

string The number format of the target parameter value string.
precision

int The precision of the target parameter value string.
errors

array: object
title

string The error title.
detail

string The error detail.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#example)
Successful retrieval of the rendered parameters (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/parameters:render' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '[
        {
          "sourceParameterValue": 100,
          "sourceUnitOrSymbolId": "autodesk.unit.symbol:cm-1.0.1",
          "targetUnitOrSymbolId": "autodesk.unit.symbol:ft-1.0.1",
          "numberFormat": "FIXED_POINT",
          "precision": 14
        },
        {
          "sourceParameterValue": 100,
          "sourceUnitOrSymbolId": "autodesk.unit.symbol:cm-1.0.1",
          "targetUnitOrSymbolId": "autodesk.unit.symbol:ft-1.0.1",
          "numberFormat": "FRACTION",
          "precision": 10
        },
        {
          "sourceParameterValue": 100,
          "sourceUnitOrSymbolId": "autodesk.unit.symbol:cm-1.0.1",
          "targetUnitOrSymbolId": "autodesk.unit.unit:1ToRatio-1.0.1",
          "numberFormat": "FRACTION",
          "precision": 4
        },
        {
          "sourceParameterValue": 188,
          "sourceUnitOrSymbolId": "autodesk.unit.symbol:cm-1.0.1",
          "targetUnitOrSymbolId": "autodesk.unit.symbol:ft-1.0.1",
          "numberFormat": "FIXED_POINT",
          "precision": 4
        },
        {
          "sourceParameterValue": 188,
          "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
          "targetUnitOrSymbolId": "autodesk.unit.symbol:ft-1.0.1",
          "numberFormat": "FIXED_POINT",
          "precision": 4
        },
        {
          "sourceParameterValue": 188,
          "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
          "targetUnitOrSymbolId": "autodesk.unit.unit:inches-1.0.1",
          "numberFormat": "FIXED_POINT",
          "precision": 4
        },
        {
          "sourceParameterValue": 188,
          "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
          "targetUnitOrSymbolId": "autodesk.unit.symbol:metersAndCentimeters-1.0.0",
          "numberFormat": "FIXED_POINT",
          "precision": 4
        },
        {
          "sourceParameterValue": 188,
          "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
          "targetUnitOrSymbolId": "autodesk.unit.symbol:inchDoubleQuote-1.0.1",
          "numberFormat": "FIXED_POINT",
          "precision": 4
        },
        {
          "sourceParameterValue": 188,
          "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
          "targetUnitOrSymbolId": "autodesk.unit.unit:feet-1.0.1",
          "numberFormat": "FRACTION",
          "precision": 4
        }
      ]'
```

Show More

### Response

```
{
  "results": [
    {
      "sourceParameterValue": 188,
      "sourceUnitOrSymbolId": "autodesk.unit.symbol:cm-1.0.1",
      "targetUnitOrSymbolId": "autodesk.unit.symbol:ft-1.0.1",
      "numberFormat": "FIXED_POINT",
      "precision": 4,
      "targetParameterValue": 6.167979002624672,
      "targetParameterValueString": "6.1680 ft"
    },
    {
      "sourceParameterValue": 188,
      "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
      "targetUnitOrSymbolId": "autodesk.unit.symbol:ft-1.0.1",
      "numberFormat": "FIXED_POINT",
      "precision": 4,
      "targetParameterValue": 6.167979002624672,
      "targetParameterValueString": "6.1680 ft"
    },
    {
      "sourceParameterValue": 188,
      "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
      "targetUnitOrSymbolId": "autodesk.unit.unit:inches-1.0.1",
      "numberFormat": "FIXED_POINT",
      "precision": 4,
      "targetParameterValue": 74.01574803149606,
      "targetParameterValueString": "74.0157"
    },
    {
      "sourceParameterValue": 188,
      "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
      "targetUnitOrSymbolId": "autodesk.unit.symbol:metersAndCentimeters-1.0.0",
      "numberFormat": "FIXED_POINT",
      "precision": 4,
      "targetParameterValue": 1.8800000000000001,
      "targetParameterValueString": "1m 88.0000cm"
    },
    {
      "sourceParameterValue": 188,
      "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
      "targetUnitOrSymbolId": "autodesk.unit.symbol:inchDoubleQuote-1.0.1",
      "numberFormat": "FIXED_POINT",
      "precision": 4,
      "targetParameterValue": 74.01574803149606,
      "targetParameterValueString": "74.0157\""
    },
    {
      "sourceParameterValue": 188,
      "sourceUnitOrSymbolId": "autodesk.unit.unit:centimeters-1.0.1",
      "targetUnitOrSymbolId": "autodesk.unit.unit:feet-1.0.1",
      "numberFormat": "FRACTION",
      "precision": 4,
      "targetParameterValue": 6.167979002624672,
      "targetParameterValueString": "6 3/16"
    }
  ],
  "errors": [
    {
      "sourceParameterValue": 100,
      "sourceUnitOrSymbolId": "autodesk.unit.symbol:cm-1.0.1",
      "targetUnitOrSymbolId": "autodesk.unit.symbol:ft-1.0.1",
      "numberFormat": "FIXED_POINT",
      "precision": 14,
      "errors": [
        {
          "title": "Bad request",
          "detail": "The precision must be from 0 to 12 indicating how many decimal places to render"
        }
      ]
    },
    {
      "sourceParameterValue": 100,
      "sourceUnitOrSymbolId": "autodesk.unit.symbol:cm-1.0.1",
      "targetUnitOrSymbolId": "autodesk.unit.symbol:ft-1.0.1",
      "numberFormat": "FRACTION",
      "precision": 10,
      "errors": [
        {
          "title": "Bad request",
          "detail": "The precision must be from 0 to 9 indicating how precisely to round the fraction"
        }
      ]
    },
    {
      "sourceParameterValue": 100,
      "sourceUnitOrSymbolId": "autodesk.unit.symbol:cm-1.0.1",
      "targetUnitOrSymbolId": "autodesk.unit.unit:1ToRatio-1.0.1",
      "numberFormat": "FRACTION",
      "precision": 4,
      "errors": [
        {
          "title": "Bad request",
          "detail": "Cannot convert between units autodesk.unit.unit:centimeters-1.0.1 and autodesk.unit.unit:1ToRatio-1.0.1."
        }
      ]
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST#) to learn more about your options. 

YES Decline


### POST Batch share parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Adds parameters to a parameter collection.

POST

# v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters:batch-share

Adds the parameters specified in the request body to the parameter collection identified in the request path. The parameters can then be discovered by listing the parameters in the collection. The request body may identify up to fifty parameters.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters:batch-share
Authentication Context user context required
Required OAuth Scopes`data:write`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. C Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement).
collectionId

string The collection ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#body-structure)
List of parameter identifiers

 Expand all

parameters

array: object List of parameter identifiers
id

string Parameter identifier

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#http-status-code-summary)

201

Created Response indicating success for a adding all of the parameters to the designated collection.
207 Response indicating partial success for adding parameters to the designated collection.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (201)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#body-structure-201)

 Expand all

results

array: object List of parameters for which the operation was successful
id

string Parameter identifier

### Response

## [Body Structure (207)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#body-structure-207)

 Expand all

results

array: object List of parameters for which the operation was successful
id

string Parameter identifier
errors

array: object List of parameters for which the operation was not successful.
id

string The resource ID.
title

string The error title.
detail

string The error detail.
code

string The error code.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#example)
Successfully associated parameters with the given collection (201).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/34379084-e8fb-49e1-ae18-fb8a8625698f/parameters:batch-share' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "parameters": [
          {
            "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:000ccf6716504165b73d20739f7dc1bf-1.0.0"
          },
          {
            "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:43d641e6cb594e8688cad2ca38ed6c95-1.0.0"
          },
          {
            "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:8d2dd2df37b84b80bf2defaff4598891-1.0.0"
          }
        ]
      }'
```

Show More

### Response

```
{
  "results": [
    {
      "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:000ccf6716504165b73d20739f7dc1bf-1.0.0"
    },
    {
      "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:43d641e6cb594e8688cad2ca38ed6c95-1.0.0"
    },
    {
      "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:8d2dd2df37b84b80bf2defaff4598891-1.0.0"
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST#) to learn more about your options. 

YES Decline

![Image 20](https://static-assets.qualtrics.com/static/prototype-ui-modules/SharedGraphics/siteintercept/svg-close-btn-black-6.svg)

![Image 21](https://pdx1.qualtrics.com/WRQualtricsSiteIntercept/Graphic.php?IM=IM_bO3tVBwmPCgDEUK)


### POST Batch unshare parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Removes shared parameters from a parameter collection.

POST

# v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters:batch-unshare

Removes the parameters specified in the request body from the parameter collection identified in the request path. The parameters will no longer be listed among the parameters in the collection. The request body may identify up to fifty parameters. Only parameters that were previously shared to the target collection may be removed with this operation, not parameters that were originally created within the target collection.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/parameters:batch-unshare
Authentication Context user context required
Required OAuth Scopes`data:write`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement).
collectionId

string The collection ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#body-structure)
List of parameter identifiers

 Expand all

parameters

array: object List of parameter identifiers
id

string Parameter identifier

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#http-status-code-summary)

200

OK Response indicating success for removing parameters from the designated collection.
207 Response indicating partial success for removing parameters from the designated collection.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#body-structure-200)

 Expand all

results

array: object List of parameters for which the operation was successful
id

string Parameter identifier

### Response

## [Body Structure (207)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#body-structure-207)

 Expand all

results

array: object List of parameters for which the operation was successful
id

string Parameter identifier
errors

array: object List of parameters for which the operation was not successful.
id

string The resource ID.
title

string The error title.
detail

string The error detail.
code

string The error code.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#example)
Successfully unassociated the parameters with the given collection (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/34379084-e8fb-49e1-ae18-fb8a8625698f/parameters:batch-unshare' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "parameters": [
          {
            "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:000ccf6716504165b73d20739f7dc1bf-1.0.0"
          },
          {
            "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:43d641e6cb594e8688cad2ca38ed6c95-1.0.0"
          },
          {
            "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:8d2dd2df37b84b80bf2defaff4598891-1.0.0"
          }
        ]
      }'
```

Show More

### Response

```
{
  "results": [
    {
      "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:000ccf6716504165b73d20739f7dc1bf-1.0.0"
    },
    {
      "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:43d641e6cb594e8688cad2ca38ed6c95-1.0.0"
    },
    {
      "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:8d2dd2df37b84b80bf2defaff4598891-1.0.0"
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#)

Review settings

CONTINUE TO SITE

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST#) to learn more about your options. 

YES Decline


---

## API Reference – Search


### POST Search parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Searches among the parameters in a parameter collection.

POST

# v1/accounts/:accountId/groups/:groupId/collections/:collectionId/parameters:search

Searches among the parameters in a parameter collection.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/accounts/:accountId/groups/:groupId/collections/:collectionId/parameters:search
Authentication Context user context required
Required OAuth Scopes`data:search`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement)
collectionId

string The collection ID.

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#query-string-parameters)

offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons..

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#body-structure)

searchedText

string The searched text. Search only checks for results in the parameter name.
sort

enum:string The sort method. Possible values: NAME_ASCENDING, NAME_DESCENDING, 
> CREATED_ASCENDING, CREATED_DESCENDING, MODIFIED_ASCENDING, MODIFIED_DESCENDING.
labelIds

array: string The label IDs. Lookup the label ID in the response of the GET /labels API.
groupBindingId

string The group ID. Lookup the group ID in the response of the GET /classifications/groups API.
dataTypeIds

array: string> The parameter data type IDs. It could be either a parameter spec ID or a category ID. When used as a “data type” identifier, a category ID indicates the “Family Type” spec with that category.

Lookup the spec ID in the response of the GET /specs API. Lookup the category ID in the response of the GET /classifications/categories API.
categoryBindingIds

array: string The classification category binding IDs. Look up detailed information in the response of the GET /classifications/categories API.
isInstance

boolean Indicates if the parameter is associated with element instances.
isType

boolean Indicates if the parameter is associated with element types.
isHidden

boolean Indicates if the parameter is hidden in the application user-interface.
isReadOnly

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set.
isArchived

boolean Indicates if the parameters are archived or not.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#http-status-code-summary)

200

OK Successful search response for parameters.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#body-structure-200)

 Expand all

pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.
results

array: object
id

string The parameter ID.
name

string The parameter’s name.
description

string The parameter description. The length of the parameter description is limited to 250 characters.
specId

string The parameter spec ID. See the [field guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec/) about the definition of spec.”
readOnly

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set..
metadata

array: object The parameter metadata. It may vary from one product to another.

For example, to support the use of a parameter in Revit, the metadata object might record category bindings and an instance/type assignment.
anyOf
0

object An object with a string ID and a Boolean value. The ID could be one of the below:

“isHidden” to indicate if the parameter is hidden or not in the application.

“isArchived” to indicate if the parameter is archived or not.
id

string The metadata ID.
value

boolean Boolean value of the metadata.
1

object An object with a string ID and an enumerated string value. The ID could be “instanceTypeAssociation” to indicate if the parameter is associated with element instances, element types, or neither. Possible values: `NONE`, `INSTANCE`, `TYPE`
id

string The metadata ID.
value

string The metadata value.
2

object An object with a string ID and a string array value. The ID could be “labelIds” to list all the labels attached to this parameter.
id

string The metadata ID.
value

array: string The metadata value.
3

object An object with a string ID and an object value. The ID could be “group” to indicate the group for this parameter.
id

string The metadata ID.
value

object The metadata value.
bindingId

string The binding ID of the group, which can be looked up in the results of the GET /classifications/groups API.
id

string The group ID, which can be looked up in the results of the GET /classifications/groups API.
4

object An object with a string ID and an object value. The ID could be “categories” to indicate the categories of this parameter.
id

string The metadata ID.
value

array: object The metadata value.
bindingId

string The category binding ID, which can be looked up in the results of the GET /classifications/categories API.
id

string The category ID, which can be looked up in the results of the GET /classifications/categories API.
5

object An object with a string ID and a string value. The ID could be “specCategoryId” to indicate the spec category ID of this family type parameter.
id

string The metadata ID.
value

string The metadata value.
valueTypeId

string The identifier of the storage value type, which could be a primitive type ID, such as Bool, Int64, Float64, String, DateTime, URI, Date, or a complex type ID.
errors

array: object
id

string The resource ID.
title

string The error title.
detail

string The error detail.
code

string The error code.

Note: Search APIs will return a (200) response even if it returns with errors in the response instead of a (207)

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#example)
Successful search for parameters (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/d05ec054-ef80-46ad-9c80-fc742f29027c/groups/d05ec054-ef80-46ad-9c80-fc742f29027c/collections/028b3307-91aa-45ec-864c-1c4af88b8a08/parameters:search' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "searchedText": "Artificial",
        "isArchived": false,
        "sort": "NAME_ASCENDING"
      }'
```

Show More

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 21,
    "nextUrl": "https://developer.api.autodesk.com/parameters/v1/accounts/d05ec054-ef80-46ad-9c80-fc742f29027c/groups/d05ec054-ef80-46ad-9c80-fc742f29027c/collections/028b3307-91aa-45ec-864c-1c4af88b8a08/parameters:search?offset=50&limit=50"
  },
  "results": [
    {
      "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:000ccf6716504165b73d20739f7dc1bf-1.0.0",
      "name": "ArtificialLighting",
      "description": ""
      "specId": "autodesk.spec:spec.string-2.0.0",
      "readOnly": false,
      "metadata": [
        {
          "id": "isHidden",
          "value": false
        },
        {
          "id": "isArchived",
          "value": false
        },
        {
          "id": "labelIds",
          "value": [
            "ACSF-01105-DTLK-44382",
            "ADJH-96226-GAKC-59763",
            "ACSY-84419-DPLC-36868"
          ]
        },
        {
          "id": "group",
          "value": null
        },
        {
          "id": "instanceTypeAssociation",
          "value": "TYPE"
        },
        {
          "id": "categories",
          "value": [
            {
              "bindingId": "ACFT-94219-HCEE-04771",
              "id": "autodesk.revit.category.family:doors-1.0.0"
            }
          ]
        },
        {
          "id": "specCategory",
          "value": null
        }
      ]
    },
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST#) to learn more about your options. 

YES Decline


### POST Search parameters indices

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Searches for the indices of the parameters in a parameter collection.

POST

# v1/accounts/:accountId/groups/:groupId/collections/:collectionId/parameters:search-indices

Indices report occurrence counts by various data types, such as by labels and category bindings. Additional types include: group bindings, data types, instances, types, hidden parameters, and archived parameters appearing among the parameters in the collection.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/accounts/:accountId/groups/:groupId/collections/:collectionId/parameters:search-indices
Authentication Context user context required
Required OAuth Scopes`data:search`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement)
collectionId

string The collection ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#body-structure)

searchedText

string The searched text.
labelIds

array: string The label IDs. Lookup the label ID in the response of the GET /labels API.
groupBindingId

string The group ID. Lookup the group ID in the response of the GET /classifications/groups API.
dataTypeIds

array: string The parameter data type IDs. It could be either a parameter spec ID or a category ID. When used as a “data type” identifier, a category ID indicates the “Family Type” spec with that category. Lookup the spec ID in the response of the GET /specs API. Lookup the category ID in the response of the GET /classifications/categories API.
categoryBindingIds

array: string The classification category binding IDs. Look up detailed information in the response of the GET /classifications/categories API.
isInstance

boolean Indicates if the parameter is associated with element instances.
isType

boolean Indicates if the parameter is associated with element types.
isHidden

boolean Indicates if the parameter is hidden in the application user-interface.
isReadOnly

boolean Indicates if the parameter is to be treated as read-only or not by a UI client. Immutable once set.
isArchived

boolean Indicates if the parameters are archived or not.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#http-status-code-summary)

200

OK Successful search response for occurrence of given indices.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#body-structure-200)

 Expand all

dataTypes

array: object The data type statistics information.
id

string The data type ID. It could be either a parameter spec ID or a category ID. When used as a “data type” identifier, a category ID indicates the “Family Type” spec with that category. Lookup the spec ID in the response of the GET /specs API. Lookup the category ID in the response of the GET /classifications/categories API.
count

int The parameter count with the data type.
labels

array: object The label statistics information.
id

string The label ID. Look up detailed information in the response of the GET /labels API.
count

int The parameter count with this label attached.
categoryBindings

array: object The category binding statistics information.
id

string The category binding ID. Look up detailed information in the response of the GET /classification/categories API.
count

string The parameter count with this category binding.
groupBindings

array: object The group binding statistics information.
id

string The group binding ID. Look up the detailed information in the response of the GET /classification/groups API.
count

int The parameter count with the group binding.
instances

int The instance parameters count.
types

int The type parameters count.
hidden

int The hidden parameters count.
archived

int The archived parameters count.

Note: Search APIs will return a (200) response even if it returns with errors in the response instead of a (207)

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#example)
Successful search for parameters-indices (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/028b3307-91aa-45ec-864c-1c4af88b8a08/parameters:search-indices' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "searchedText": "",
        "isArchived": false,
        "dataTypeIds": ["autodesk.spec:spec.string-2.0.0"]
      }'
```

Show More

### Response

```
{
  "dataTypes": [
    {
      "typeId": "autodesk.spec:spec.string-2.0.0",
      "count": 24
    }
  ],
  "labels": [
    {
      "id": "ACSF-01105-DTLK-44382",
      "count": 10
    },
    {
      "id": "ACTL-74886-BQNU-54596",
      "count": 10
    },
    {
      "id": "ACSY-84419-DPLC-36868",
      "count": 6
    },
    {
      "id": "ACVE-47566-JESZ-35795",
      "count": 3
    },
    {
      "id": "ACVE-40432-GAMP-63893",
      "count": 1
    }
  ],
  "categoryBindings": [
    {
      "id": "ACFT-94219-HCEE-04771",
      "count": 2
    },
    {
      "id": "ACFT-94219-HCZK-47813",
      "count": 2
    }
  ],
  "groupBindings": [
    {
      "id": "ABXZ-68714-GTBT-61905",
      "count": 2
    }
  ],
  "instances": 1,
  "types": 1,
  "hidden": 0,
  "archived": 0
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST#) to learn more about your options. 

YES Decline


---

## API Reference – Enumerations


### GET List enumerations

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Lists enumerations in a Forma hub.

GET

# v1/enumerations

Lists enumerations in a Forma hub.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/enumerations
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#query-string-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID. If not provided, will return enumerations used by the system.
ids

string The enumeration ID(s) that you would like to return, split by commas. Providing no enumeration IDs will return all enumerations in the Forma hub.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.

Note- To see what parameters are using an enumeration data type, use the Search Parameters API.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#http-status-code-summary)

200

OK Successful retrieval of the enumerations within the designated collection.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#body-structure-200)

 Expand all

results

array: object The enumeration results.
id

string The enumeration ID.
name

string The enumeration name.
content

array: object The enumeration content. A map with keys of type string and values of type number.
id

string The enumeration ID for a single item in the list.
value

number The enumeration value for a single item in the list.
createdBy

string User that created the enumeration.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the enumeration was created.
pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#example)
Successful retrieval of the enumerations (200).

### Request

```
curl -v 'https://developer-stg.api.autodesk.com/parameters/v1/accounts/enumerations?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
   "results": [
       {
           "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73d-2.0.0",
           "name": "some enumeration",
           "content": [
               {
                   "id": "item11",
                   "value": 0
               },
               {
                   "id": "item2",
                   "value": 1
               }
           ],
           "createdBy": "FXA2K4JGR5BECGSK",
           "createdAt": "2024-11-11T16:22:29+0000"
       },
       {
           "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:d4756f9ff2d94b1b92cbf0eaf34662ce-1.0.0",
           "name": "test 746",
           "content": [
               {
                   "id": "test746",
                   "value": 0
               }
           ],
           "createdBy": "FXA2K4JGR5BECGSK",
           "createdAt": "2024-08-30T16:45:41+0000"
       }
   ],
   "pagination": {
       "offset": 0,
       "limit": 50,
       "totalResults": 2
   }
 }
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET#) to learn more about your options. 

YES Decline


### POST Create enumerations

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Creates new enumerations.

POST

# v1/enumerations:batch-create

Creates new enumeration definitions.

The maximum number per request is 50. For changing enumeration definitions, use [the update enumerations API](https://aps.autodesk.com/en/docs/parameters/v1/reference/parameters-updateenumerations-PATCH/) to set them. Use [List Collections API](https://aps.autodesk.com/en/docs/parameters/v1/reference/parameters-listparametercollections-GET/) to get the collection ID.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/enumerations:batch-create
Authentication Context user context required
Required OAuth Scopes`data:create` or `data:write`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#query-parameters)

accountId*

string: UUID or string: b.UUID The Autodesk Forma hub ID. Required.

* Required

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#body-structure)
Object

 Expand all

enumerations*

array: object The list of enumerations to update.
id

string The enumeration ID. Must be full type id.
name*

string The enumeration name. The length of the enumeration name is limited to 255 characters. An enumeration name can’t be a restricted word: `mm cm m km log sqrt sin cos tan asin acos atan exp abs pi round roundup rounddn` An enumeration’s name can’t contain any of these prohibited symbol(s): \ : { } [ ]`
content*

object The enumeration content. Must be a non-empty map with keys of type string and values of type number. For more information about specs and enumerations, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide).

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#http-status-code-summary)

201

Created Successfully created the enumerations.
207

Partial Success Successfully created some of the enumerations, with errors for some enumerations in the batch.
400

Bad Request The request could not be understood by the server due to malformed syntax. This may occur when enumeration validation fails, such as when the enumeration name is too long or contains prohibited symbols. The response should include what validation rule was violated.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (201)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#body-structure-201)

 Expand all

results

array: object The enumeration creation results.
id

string The enumeration ID.
name

string The enumeration name.
content

object The enumeration content. A map with keys of type string and values of type number.
id

string The enumeration ID for a single item in the list.
value

number The enumeration value for a single item in the list.
createdBy

string User that created the enumeration.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the enumeration was created.

## [Body Structure (207)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#body-structure-207)

 Expand all

results

array: object The enumeration creation results.
id

string The enumeration ID.
name

string The enumeration name.
content

object The enumeration content. Must be non empty map with keys of type string and values of type number.
id

string The enumeration ID for a single item in the list.
value

number The enumeration value for a single item in the list.
createdBy

string User that created the enumeration.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the enumeration was created.
errors

array: object The errors.
id

string The resource ID.
title

string The error title.
detail

string The error detail.
code

string The error code.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#example)
Successfully Created Enumeration(s) (201)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/enumerations:batch-create?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2F' \
  -H 'Content-Type: application/json' \
  -d '{
        "enumerations": [
          {
            "name": "Stoplight Color",
            "content": [
              {
                "id": "Red",
                "value": 0
              },
              {
                "id": "Yellow",
                "value": 1
              },
              {
                "id": "Green",
                "value": 2
              }
            ]
          }
        ]
     }'
```

Show More

### Response

```
{
  "results": [
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
          "name": "Stoplight Color",
          "content": [
              {
                "id": "Red",
                "value": 0
              },
              {
                "id": "Yellow",
                "value": 1
              },
              {
                "id": "Green",
                "value": 2
              }
          ],
          "createdBy": "FXA2K4JGR5BECGSF",
          "createdAt": "2024-11-11T16:18:53+0000"
      }
  ]
}
```

Show More

Partial Success Creating Enumerations (207)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/enumerations:batch-create?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "enumerations": [
          {
            "name": "Stoplight Color",
            "content": [
              {
                "id": "Red",
                "value": 0
              },
              {
                "id": "Yellow",
                "value": 1
              },
              {
                "id": "Green",
                "value": 2
              }
            ]
          },
          {
            "name": "Door Swing Direction",
            "content": [
              {
                "id": "Into Room",
                "value": -1
              },
              {
                "id": "Out of Room",
                "value": 1
              }
            ]
          }
        ]
      }'
```

Show More

### Response

```
{
  "results": [
      {
         "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
          "name": "Stoplight Color",
          "content": [
              {
                "id": "Red",
                "value": 0
              },
              {
                "id": "Yellow",
                "value": 1
              },
              {
                "id": "Green",
                "value": 2
              }
          ],
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-19T19:17:05+0000"
      }
  ],
  "errors": [
      {
          "id": "dec8e229344745538a055f24d865c27e",
          "title": "Bad request",
          "detail": "The enumeration content value is invalid, it must be a positive integer number"
      }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST#) to learn more about your options. 

YES Decline


### PATCH Update enumerations

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Updates enumerations.

PATCH

# v1/enumerations:batch-update

Updates a list of enumerations (maximum amount per request is 50) with the given properties, including content.

The edits you make to an enumeration will automatically increment the version number, based on semantic versioning.

Patch edits (e.g. 1.0.0 -> 1.0.1) include changing the order in which values are listed or changing the enumeration name recorded in the schema title.

Minor edits (e.g. 1.0.0 -> 1.1.0) include adding a new value to the enumeration.

Major edits (e.g. 1.0.0 -> 2.0.0) include removing a value from the enumeration, renaming the symbolic identifier for a value, or changing the numeric value associated with a certain symbol.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#resource-information)

Method and URI PATCH

 https://developer.api.autodesk.com/parameters/v1/enumerations:batch-update
Authentication Context user context required
Required OAuth Scopes`data:write` or `data:create`
Data Format JSON

Note: Data will be updated according to the JSON Merge Patch protocol.

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#query-string-parameters)

accountId*

string: UUID or string: b.UUID The Autodesk Forma hub ID.

* Required

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#body-structure)
Object

 Expand all

enumerations*

array: object The list of enumerations to update.
id

string The enumeration ID. Must be full type id.
name*

string The enumeration name.
content*

object The enumeration content. Must be non empty map with keys of type string and values of type number.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#http-status-code-summary)

200

OK Successfully updated the given enumerations.
207

Partial Success Successfully updated some enumerations, with errors for some enumerations in the batch.
400

Bad Request The request could not be understood by the server due to malformed syntax. This may occur when enumerations validation fails, such as when the enumerations name is too long or contains prohibited symbols. The response should include what validation rule was violated.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

Successfully Updated Enumerations (200)

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#body-structure-200)

 Expand all

results

array: object
id

string The enumeration ID with new version number.
previousRevisionId

string The previous ID of the enumeration before it was updated.
name

string The enumeration name.
content

array: object The enumeration content. A map with keys of type string and values of type number.
createdBy

string User that created the enumeration.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the enumeration was created.

Partial Success Updating Enumerations (207)

## [Body Structure (207)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#body-structure-207)

 Expand all

results

array: object
id

string The enumeration ID with new version number.
previousRevisionId

string The previous ID of the enumeration before it was updated.
name

string The enumeration name.
content

array: object The enumeration content. Must be non empty map with keys of type string and values of type number.
createdBy

string User that created the enumeration.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the enumeration was created.
errors

array: object
id

string The resource ID.
title

string The error title.
detail

string The error detail.
code

string The error code.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#example)
Successfully Updated Enumerations (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/enumerations:batch-update?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'PATCH' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
         "enumerations": [
          {
            "name": "Stoplight Color",
            "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.0",
            "content": [
              {
                "id": "Red",
                "value": 0
              },
              {
                "id": "Yellow",
                "value": 1
              },
              {
                "id": "Green",
                "value": 2
              },
              {
                "id": "Turn Arrow",
                "value": 3
              }
            ]
          },
          {
            "name": "Installation Complete",
            "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:b3aef626f5354c7aa032c1048416f5ea-1.0.0",
            "content": [
              {
                "id": "Yes",
                "value": 21
              },
              {
                "id": "No",
                "value": 22
              },
              {
                "id": "Back-ordered",
                "value": 23
              }
            ]
          }
        ]
      }'
```

Show More

### Response

```
{
  "results": [
      {
          "name": "Stoplight Color",
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.1",
          "previousRevisionId": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.0",
          "content": [
            {
              "id": "Red",
              "value": 0
            },
            {
              "id": "Yellow",
              "value": 1
            },
            {
              "id": "Green",
              "value": 2
            },
            {
              "id": "Turn Arrow",
              "value": 3
            }
          ],
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-19T19:31:46+0000"
      },
      {
         "name": "Installation Complete",
          "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:b3aef626f5354c7aa032c1048416f5ea-1.0.1",
          "previousRevisionId": "parameters.d05ec054ef8046ad9c80fc742f29027c:b3aef626f5354c7aa032c1048416f5ea-1.0.0",
          "content": [
            {
              "id": "Yes",
              "value": 21
            },
            {
              "id": "No",
              "value": 22
            },
            {
              "id": "Back-ordered",
              "value": 23
            }
          ],
          "createdBy": "DWFAK4JGR5BECGSR",
          "createdAt": "2024-12-19T19:31:46+0000"
      }
  ]
}
```

Show More

Partial Success Updating Enumerations (207).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/enumerations:batch-update?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'PATCH' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
       "enumerations": [
          {
            "name": "Stoplight Color",
            "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.0",
            "content": [
              {
                "id": "Red",
                "value": 0
              },
              {
                "id": "Yellow",
                "value": 1
              },
              {
                "id": "Green",
                "value": 2
              },
              {
                "id": "Turn Arrow",
                "value": 3
              }
            ]
          },
          {
            "name": "Installation Complete",
            "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:b3aef626f5354c7aa032c1048416f5ea-1.0.0",
            "content": [
              {
                "id": "Yes",
                "value": 21
              },
              {
                "id": "No",
                "value": 22
              },
              {
                "id": "Back-ordered",
                "value": -2
              }
            ]
          }
        ]
      }'
```

Show More

### Response

```
{
  "results": [
      {
         "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.1",
          "previousRevisionId": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.0",
          "version": "2.0.1",
          "type": "enumeration",
          "description": "Enumeration of stoplight colors.",
          "isDeprecated": false,
          "isRequired": true,
         "name": "Stoplight Color",
          "content": [
            {
              "id": "Red",
              "value": 0
            },
            {
              "id": "Yellow",
              "value": 1
            },
            {
              "id": "Green",
              "value": 2
            },
            {
              "id": "Turn Arrow",
              "value": 3
            }
          ],
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-19T19:31:46+0000"
      }
  ],
  "errors": [
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:95d502d557524f45a1bdad92f8b73fcf-1.0.0",
          "title": "Bad request",
          "detail": "The enumeration content value is invalid, it must be a positive integer number"
      }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH#) to learn more about your options. 

YES Decline


### PATCH Update enumeration

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Updates an enumeration.

PATCH

# v1/enumerations/{enumerationId}

Updates an enumeration with the given properties, including content.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#resource-information)

Method and URI PATCH

 https://developer.api.autodesk.com/parameters/v1/enumerations/{enumerationId}
Authentication Context user context required
Required OAuth Scopes`data:create` or `data:write`
Data Format JSON

Note: Data will be updated according to the JSON Merge Patch protocol.

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#uri-parameters)

enumerationId

string The ID of the enumeration you are updating.

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#query-string-parameters)

accountId*

string: UUID or string: b.UUID The Autodesk Forma hub ID.

* Required

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#body-structure)
Object

name*

string The enumeration name.
content*

object The enumeration content. Must be non empty map with keys of type string and values of type number.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#http-status-code-summary)

200

OK Successfully updated the given enumerations.
400

Bad Request The request could not be understood by the server due to malformed syntax. This may occur when enumerations validation fails, such as when the enumerations name is too long or contains prohibited symbols. The response should include what validation rule was violated.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

Successfully Updated Enumeration (200)

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#body-structure-200)

 Expand all

results

array: object
id

string The enumeration ID with new version number.
previousRevisionId

string The previous ID of the enumeration before it was updated.
name

string The enumeration name.
content

array: object The enumeration content. Must be non empty map with keys of type string and values of type number.
createdBy

string User that created the enumeration.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the enumeration was created.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#example)
Successfully Updated Enumeration (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/enumerations/parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'PATCH' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "name": "Project Phase",
        "content": [
            {
              "id": "Pre-Design",
              "value": 0
            },
            {
              "id": "Schematic Design",
              "value": 1
            },
            {
              "id": "Design Development",
              "value": 2
            },
            {
              "id": "Bidding",
              "value": 3
            },
            {
              "id": "Permitting",
              "value": 4
            },
            {
              "id": "Construction",
              "value": 5
            }
        ]
      }'
```

Show More

### Response

```
{
  "results": [
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-2.0.0",
          "name": "Project Phase",
          "content": [
            {
              "id": "Pre-Design",
              "value": 0
            },
            {
              "id": "Schematic Design",
              "value": 1
            },
            {
              "id": "Design Development",
              "value": 2
            },
            {
              "id": "Bidding",
              "value": 3
            },
            {
              "id": "Permitting",
              "value": 4
            },
            {
              "id": "Construction",
              "value": 5
            }
          ],
          "createdBy": "FXA2K4JGR5BECGSF",
          "createdAt": "2024-11-11T16:22:29+0000"
      }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH#) to learn more about your options. 

YES Decline


---

## API Reference – Specs


### GET List specs

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Lists parameter specs.

GET

# v1/specs

By default, lists parameter specs used in the system. Specs define data types and describe, for example, how data is stored and presented to the user. For more information about the definition of specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec). For this endpoint, the user (authorization token) does not need access to a given Forma hub.

If you provide a Forma hub ID in the request, the endpoint will return the user-defined specs to support enumerations. If you provide the Spec ID(s) in the request, the endpoint will return the Spec(s) with the provided ID(s). When using this endpoint with an Forma hub ID, the user must have access to the given Forma hub.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/specs
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#query-string-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID. If not provided, will return specs used by the system. If provided, will return the user defined specs to support enumerations.
ids

string The Spec ID(s) that you would like to return, split by a comma. Providing no Spec ID will return all user-defined Specs in the Forma hub.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.

Note- To see what parameters are using an enumeration data type, use the Search Parameters API.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#http-status-code-summary)

200

OK Successful retrieval of the parameter specs used in the system.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#body-structure-200)

 Expand all

pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.
results

array: object
id

string The spec ID.
name

string The user-facing name of the spec.
disciplineId

string The discipline ID. Look up detailed information in the response of the GET /disciplines API.
applicableUnitIds

array: string The identifiers of the units applicable to this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”.
storageUnitId

string The identifier of the storage unit of this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”. The storage unit is the unit of measurement that quantifies values of this parameter in persistent storage. When writing parameter values, client applications must ensure that the values written are quantified according to each parameter’s storage unit. A unit conversion might be necessary if input values are quantified differently.
valueTypeId

string The identifier of the storage value type, which could be Bool, Int64, Float64, Reference, String or a type ID. Value Type IDs support version ranges. For more information about version ranges in specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec). Results are returned for the highest applicable Value Type Id version available.
context

string The value “single” indicates that the spec stores a single value. The value “array” indicates that the spec stores an array of values.
createdBy

string User that created the parameter.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the parameter was created.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#example)
Successful retrieval of the specs (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs'
```

### Response

```
{
  "results": [
    {
      "id": "autodesk.spec.aec.structural:linearMomentScale-2.0.0",
      "name": "Linear Moment Scale",
      "disciplineId": "autodesk.spec.discipline:structural-1.0.0",
      "applicableUnitIds": [
        "autodesk.unit.unit:feetPerKip-1.0.0",
        "autodesk.unit.unit:metersPerKilonewton-1.0.0"
      ],
      "storageUnitId": "autodesk.unit.unit:metersPerKilonewton-1.0.0",
      "valueTypeId": "Float64",
      "context": "single",
      "createdBy": "System Generated",
      "createdAt": "System Generated"
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 1
  }
}
```

Show More

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea'
    -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "results": [
    {
      "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:4abfb8015fc34e17816b64abe0522864-14.0.0",
      "name": "Multiple Select: Lunch Order Items",
      "disciplineId": "autodesk.spec:discipline-2.0.0",
      "applicableUnitIds": null,
      "storageUnitId": null,
      "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:ba31c7ca1b7842e282211830d7f6f5a7-17.0.0",
      "context": "array",
      "createdBy": "FXA2K4JGR5BECGSF",
      "createdAt": "2024-11-05T18:55:42+0000",
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 1
  }
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET#) to learn more about your options. 

YES Decline


### POST Create specs

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Creates new specs.

POST

# v1/specs:batch-create

Creates new specs.

The maximum number per request is 50. For changing spec definitions, use [the update specs API](https://aps.autodesk.com/en/docs/parameters/v1/reference/parameters-updatespecs-PATCH/) to set them. Use List Collections API to get the collection ID.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/specs:batch-create
Authentication Context user context required
Required OAuth Scopes`data:create` or `data:write`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#query-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID. Required.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#body-structure)
Object

 Expand all

specs*

array: object The list of specs to create.
id

string The spec ID. Must be full type id.
valueTypeId*

string The identifier of the storage value type, which could be a primitive type ID, such as Bool, Int64, Float64, String, DateTime, URI, Date, or a complex type ID. Value Type IDs support version ranges. For more information about version ranges in specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec).
context*

object The spec context - “single” or “array”. For more information about specs and enumerations, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide).

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#http-status-code-summary)

201

Created Successfully created the spec.
207

Partial Success Successfully created some of the spec, with errors for some spec in the batch.
400

Bad Request The request could not be understood by the server due to malformed syntax. This may occur when spec validation fails, such as when the spec name is too long or contains prohibited symbols. The response should include what validation rule was violated.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (201)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#body-structure-201)

 Expand all

results

array: object The spec creation results.
id

string The spec ID.
name

string The user-facing name of the spec.
disciplineId

string The discipline ID. Look up detailed information in the response of the GET /disciplines API.
applicableUnitIds

array: string The identifiers of the units applicable to this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”.
storageUnitId

string The identifier of the storage unit of this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”. The storage unit is the unit of measurement that quantifies values of this parameter in persistent storage. When writing parameter values, client applications must ensure that the values written are quantified according to each parameter’s storage unit. A unit conversion might be necessary if input values are quantified differently.
valueTypeId

string The identifier of the storage value type, which could be Bool, Int64, Float64, Reference, String or a type ID. Value Type IDs support version ranges. For more information about version ranges in specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec). Results are returned for the highest applicable Value Type Id version available.
context

string The value “single” indicates that the spec stores a single value. The value “array” indicates that the spec stores an array of values.
content

array: object The spec content. Provided only for specs with enumeration value types, this field contains the body of the enumeration as a map with keys of type string and values of type number.
id

string The enumeration ID for a single item in the list.
value

number The enumeration value for a single item in the list.
createdBy

string User that created the spec.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the spec was created.

## [Body Structure (207)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#body-structure-207)

 Expand all

results

array: object The spec creation results.
id

string The spec ID.
name

string The user-facing name of the spec.
disciplineId

string The discipline ID. Look up detailed information in the response of the GET /disciplines API.
applicableUnitIds

array: string The identifiers of the units applicable to this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”.
storageUnitId

string The identifier of the storage unit of this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”. The storage unit is the unit of measurement that quantifies values of this parameter in persistent storage. When writing parameter values, client applications must ensure that the values written are quantified according to each parameter’s storage unit. A unit conversion might be necessary if input values are quantified differently.
valueTypeId

string The identifier of the storage value type, which could be Bool, Int64, Float64, Reference, String or a type ID. Value Type IDs support version ranges. For more information about version ranges in specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec). Results are returned for the highest applicable Value Type Id version available.
context

string The value “single” indicates that the spec stores a single value. The value “array” indicates that the spec stores an array of values.
content

array: object The spec content. Provided only for specs with enumeration value types, this field contains the body of the enumeration as a map with keys of type string and values of type number.
id

string The enumeration ID for a single item in the list.
value

number The enumeration value for a single item in the list.
createdBy

string User that created the spec.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the spec was created.
errors

array: object The errors.
id

string The resource ID.
title

string The error title.
detail

string The error detail.
code

string The error code.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#example)
Successfully Created Spec(s) (201)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs:batch-create?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "specs": [
          {
            "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
            "context": "single"
          },
          {
            "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
            "context": "array"
          }
        ]
       }'
```

Show More

### Response

```
{
  "results": [
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:8bb37d61b3dc489aa94d6bac3d88038c-1.0.0",
          "name": "Multiple Select: some spec",
          "valueTypeId": "b3aef626-f535-4c7a-a032-c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
          "context": "array",
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-11T16:18:56+0000",
          "disciplineId": "autodesk.spec:discipline-2.0.0",
          "applicableUnitIds": null,
          "storageUnitId": null,
          "content": [
              {
                  "id": "item1",
                  "value": 0
              },
              {
                  "id": "item2",
                  "value": 1
              }
          ]
      },
      {
          "id": "b3aef626-f535-4c7a-a032-c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-1.0.0",
          "name": "Single Select: some spec",
          "valueTypeId": "b3aef626-f535-4c7a-a032-c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-1.0.0",
          "context": "single",
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-11T16:18:56+0000",
          "disciplineId": "autodesk.spec:discipline-2.0.0",
          "applicableUnitIds": null,
          "storageUnitId": null,
          "content": [
              {
                  "id": "item1",
                  "value": 0
              },
              {
                  "id": "item2",
                  "value": 1
              }
          ]
      }
  ]
}
```

Show More

Partial Success Creating Specs (207)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs:batch-create?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "specs": [
          {
            "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:95d502d557524f45a1bdad92f8b73fcf-2.0.0",
            "context": "array"
          },
          {
            "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:95d502d557524f45a1bdad92f8b73fcf-2.0.0",
            "context": "single"
          },
          {
            "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.1",
            "context": "array1"
          },
          {
            "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.1",
            "context": "single1"
          }
        ]
      }'
```

Show More

### Response

```
{
  "results": [
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:233873a17cd044a7a25a32549d95f53e-1.0.0",
          "name": "Single Select: some spec2",
          "valueTypeId": "parameters.d05ec054ef8046ad9c80fc742f29027c:95d502d557524f45a1bdad92f8b73fcf-2.0.0",
          "context": "single",
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-19T19:38:43+0000",
          "disciplineId": "autodesk.spec:discipline-2.0.0",
          "applicableUnitIds": null,
          "storageUnitId": null,
          "content": [
              {
                  "id": "item2000",
                  "value": 2
              }
          ]
      },
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:fb6bbd78f30e438cb1b22ed9d50e9c91-1.0.0",
          "name": "Multiple Select: some spec2",
          "valueTypeId": "parameters.d05ec054ef8046ad9c80fc742f29027c:95d502d557524f45a1bdad92f8b73fcf-2.0.0",
          "context": "array",
          "createdBy": "FXA2K4JGR5BECGSR",
          "createdAt": "2024-11-19T19:38:43+0000",
          "disciplineId": "autodesk.spec:discipline-2.0.0",
          "applicableUnitIds": null,
          "storageUnitId": null,
          "content": [
              {
                  "id": "item2000",
                  "value": 2
              }
          ]
      }
  ],
  "errors": [
      {
          "code": "SPEC-INVALID-SPEC",
          "title": "Bad request",
          "detail": "Cannot read properties of undefined (reading 'value')",
          "id": "eb848cecdd804386838dcb615f5a75cb"
      },
      {
          "code": "SPEC-INVALID-SPEC",
          "title": "Bad request",
          "detail": "Cannot read properties of undefined (reading 'value')",
          "id": "f9bfa9a8c0bc42bf9fbf1c5064478b92"
      }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST#) to learn more about your options. 

YES Decline


### PUT Update specs

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Updates specs.

PUT

# v1/specs:batch-update

Updates a list of specs (maximum amount per request is 10) with the latest version of the enumeration used in the spec.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#resource-information)

Method and URI PUT

 https://developer.api.autodesk.com/parameters/v1/specs:batch-update
Authentication Context user context required
Required OAuth Scopes`data:create` or `data:write`
Data Format JSON

Note: Data will be updated according to the JSON Merge Patch protocol.

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#query-string-parameters)

accountId*

string: UUID or string: b.UUID The Autodesk Forma hub ID.

* Required

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#body-structure)
Object

 Expand all

specs*

array: object The list of specs to update.
id*

string The spec ID. Must be full type id.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#http-status-code-summary)

200

OK Successfully updated the given specs.
207

Partial Success Successfully updated some specs, with errors for some specs in the batch.
400

Bad Request The request could not be understood by the server due to malformed syntax. This may occur when specs validation fails, such as when the specs name is too long or contains prohibited symbols. The response should include what validation rule was violated.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

Successfully Updated Specs (200)

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#body-structure-200)

 Expand all

results

array: object
id

string The spec ID.
name

string The user-facing name of the spec.
disciplineId

string The discipline ID. Look up detailed information in the response of the GET /disciplines API.
applicableUnitIds

array: string The identifiers of the units applicable to this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”.
storageUnitId

string The identifier of the storage unit of this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”. The storage unit is the unit of measurement that quantifies values of this parameter in persistent storage. When writing parameter values, client applications must ensure that the values written are quantified according to each parameter’s storage unit. A unit conversion might be necessary if input values are quantified differently.
valueTypeId

string The identifier of the storage value type, which could be Bool, Int64, Float64, Reference, String or a type ID. Value Type IDs support version ranges. For more information about version ranges in specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec). Results are returned for the highest applicable Value Type Id version available.
context

string The value “single” indicates that the spec stores a single value. The value “array” indicates that the spec stores an array of values.
content

array: object The spec content. Provided only for specs with enumeration value types, this field contains the body of the enumeration as a map with keys of type string and values of type number.
id

string The enumeration ID for a single item in the list.
value

number The enumeration value for a single item in the list.
createdBy

string User that created the spec.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the spec was created.

Partial Success Updating Specs (207)

## [Body Structure (207)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#body-structure-207)

 Expand all

results

array: object
id

string The spec ID.
name

string The user-facing name of the spec.
disciplineId

string The discipline ID. Look up detailed information in the response of the GET /disciplines API.
applicableUnitIds

array: string The identifiers of the units applicable to this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”.
storageUnitId

string The identifier of the storage unit of this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”. The storage unit is the unit of measurement that quantifies values of this parameter in persistent storage. When writing parameter values, client applications must ensure that the values written are quantified according to each parameter’s storage unit. A unit conversion might be necessary if input values are quantified differently.
valueTypeId

string The identifier of the storage value type, which could be Bool, Int64, Float64, Reference, String or a type ID. Value Type IDs support version ranges. For more information about version ranges in specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec). Results are returned for the highest applicable Value Type Id version available.
context

string The value “single” indicates that the spec stores a single value. The value “array” indicates that the spec stores an array of values.
content

array: object The spec content. Provided only for specs with enumeration value types, this field contains the body of the enumeration as a map with keys of type string and values of type number.
id

string The enumeration ID for a single item in the list.
value

number The enumeration value for a single item in the list.
createdBy

string User that created the spec.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the spec was created.
errors

array: object
id

string The resource ID.
title

string The error title.
detail

string The error detail.
code

string The error code.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#example)
Successfully Updated Specs (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs:batch-update' \
  -X 'PUT' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "specs": [
          {
            "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-1.0.0"
          },
          {
            "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:8bb37d61b3dc489aa94d6bac3d88038c-1.0.0"
          }
        ]
      }'
```

Show More

### Response

```
{
   "results": [
       {
           "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-2.0.0",
           "name": "Single Select: some spec",
           "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-2.0.0",
           "context": "single",
           "createdBy": "FXA2K4JGR5BECGSR",
           "createdAt": "2024-11-11T16:22:31+0000",
           "disciplineId": "autodesk.spec:discipline-2.0.0",
           "applicableUnitIds": null,
           "storageUnitId": null,
           "content": [
               {
                   "id": "item11",
                   "value": 0
               },
               {
                   "id": "item2",
                   "value": 1
               }
           ],
           "previousRevisionId": "parameters.b3aef626f5354c7aa032c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-1.0.0"
       },
       {
           "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:8bb37d61b3dc489aa94d6bac3d88038c-2.0.0",
           "name": "Multiple Select: some spec",
           "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-2.0.0",
           "context": "array",
           "createdBy": "FXA2K4JGR5BECGSR",
           "createdAt": "2024-11-11T16:22:31+0000",
           "disciplineId": "autodesk.spec:discipline-2.0.0",
           "applicableUnitIds": null,
           "storageUnitId": null,
           "content": [
               {
                   "id": "item11",
                   "value": 0
               },
               {
                   "id": "item2",
                   "value": 1
               }
           ],
           "previousRevisionId": "parameters.b3aef626f5354c7aa032c1048416f5ea:8bb37d61b3dc489aa94d6bac3d88038c-1.0.0"
       }
   ]
}
```

Show More

Partial Success Updating Specs (207).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs:batch-update' \
  -X 'PUT' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "specs": [
          {
            "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:fe82bd1dbfa64a6fae5ee14f6171301b-1.0.0"
          },
          {
            "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:9dbcf4dca2e74edeb4faec744f0b7aa8-1.0.0"
          }
        ]
      }'
```

Show More

### Response

```
{
   "results": [
       {
           "id": "parameters.d05ec054ef8046ad9c80fc742f29027c:9dbcf4dca2e74edeb4faec744f0b7aa8-1.0.1",
           "name": "Multiple Select: some spec12",
           "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:a644eb8695914628a259fd5a3b37f622-2.0.2",
           "context": "array",
           "createdBy": "FXA2K4JGR5BECGSR",
           "createdAt": "2024-11-19T19:47:48+0000",
           "disciplineId": "autodesk.spec:discipline-2.0.0",
           "applicableUnitIds": null,
           "storageUnitId": null,
           "content": [
               {
                   "id": "item11",
                   "value": 0
               },
               {
                   "id": "item2",
                   "value": 1
               }
           ],
           "previousRevisionId": "parameters.d05ec054ef8046ad9c80fc742f29027c:9dbcf4dca2e74edeb4faec744f0b7aa8-1.0.0"
       }
   ],
   "errors": [
       {
           "code": "SPEC-INVALID-SPEC",
           "title": "Bad request",
           "detail": "The Spec with the given ID does not exist",
           "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:fe82bd1dbfa64a6fae5ee14f6171301b-1.0.0"
       }
   ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT#) to learn more about your options. 

YES Decline


### PUT Update spec

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Updates a spec.

PUT

# v1/specs/{specId}

Updates a spec with the latest version of the enumeration used in the spec.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#resource-information)

Method and URI PUT

 https://developer.api.autodesk.com/parameters/v1/specs/{specId}
Authentication Context user context required
Required OAuth Scopes`data:create` or `data:write`
Data Format JSON

Note: Data will be updated according to the JSON Merge Patch protocol.

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#query-string-parameters)

accountId*

string: UUID or string: b.UUID The Autodesk Forma hub ID.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#http-status-code-summary)

200

OK Successfully updated the given spec.
400

Bad Request The request could not be understood by the server due to malformed syntax. This may occur when spec validation fails, such as when the spec name is too long or contains prohibited symbols. The response should include what validation rule was violated.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

Successfully Updated Spec (200)

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#body-structure-200)

 Expand all

results

array: object
id

string The spec ID.
name

string The user-facing name of the spec.
disciplineId

string The discipline ID. Look up detailed information in the response of the GET /disciplines API.
applicableUnitIds

array: string The identifiers of the units applicable to this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”.
storageUnitId

string The identifier of the storage unit of this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”. The storage unit is the unit of measurement that quantifies values of this parameter in persistent storage. When writing parameter values, client applications must ensure that the values written are quantified according to each parameter’s storage unit. A unit conversion might be necessary if input values are quantified differently.
valueTypeId

string The identifier of the storage value type, which could be Bool, Int64, Float64, Reference, String or a type ID. Value Type IDs support version ranges. For more information about version ranges in specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec). Results are returned for the highest applicable Value Type Id version available.
context

string The value “single” indicates that the spec stores a single value. The value “array” indicates that the spec stores an array of values.
content

array: object The spec content. Provided only for specs with enumeration value types, this field contains the body of the enumeration as a map with keys of type string and values of type number.
id

string The enumeration ID for a single item in the list.
value

number The enumeration value for a single item in the list.
createdBy

string User that created the spec.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the spec was created.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#example)
Successfully Updated Spec (200).

### Request

```
curl -v 'https://developer-stg.api.autodesk.com/parameters/v1/specs/parameters.b3aef626f5354c7aa032c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-1.0.0?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea' \
  -X 'PUT' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
```

### Response

```
{
  "results": [
      {
          "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-2.0.0",
          "name": "Single Select: some spec",
          "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:61712b031b1e49e897e3cf1643dea73e-2.0.0",
          "context": "single",
          "createdBy": "FXA2K4JGR5BECGSF",
          "createdAt": "2024-11-11T16:22:31+0000",
          "disciplineId": "autodesk.spec:discipline-2.0.0",
          "applicableUnitIds": null,
          "storageUnitId": null,
          "content": [
              {
                  "id": "item11",
                  "value": 0
              },
              {
                  "id": "item2",
                  "value": 1
              }
          ],
          "previousRevisionId": "parameters.b3aef626f5354c7aa032c1048416f5ea:d8cf6d9ae20d4775b1a246399d4ff48a-1.0.0"
      }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT#) to learn more about your options. 

YES Decline


---

## API Reference – Labels


### GET Retrieve labels

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Lists the labels in the given hub.

GET

# v1/accounts/{accountId}/labels

Lists the labels in a hub.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/labels
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET#query-string-parameters)

offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET#http-status-code-summary)

200

OK Successful retrieval of all labels within a hub.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET#body-structure-200)

 Expand all

pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.
result

array: object
id

string The label ID.
name

string The label name.
description

string The label description.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET#example)
Successful retrieval of the labels (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/labels' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "pagination": {
    "totalResults": 89,
    "offset": 0,
    "limit": 50,
    "nextUrl": "https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/labels?offset=50&limit=50"
  },
  "results": [
    {
      "id": "ACMT-69415-CEVT-22201",
      "name": "test",
      "description": ""
    },
    {
      "id": "ACNL-88665-BCSL-99749",
      "name": "General",
      "description": ""
    },
    {
      "id": "ACNL-88665-BDMS-42782",
      "name": "Rebar Shape Families",
      "description": ""
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)


### POST Create labels

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Creates new labels.

POST

# v1/accounts/{accountId}/labels

Creates new labels, maximum amount per request is 20.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/labels
Authentication Context user context required
Required OAuth Scopes`data:create`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement).
collectionId

string The collection ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST#body-structure)
Object:Array

name

string The new label name.
description

string The new label description.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST#http-status-code-summary)

201

Created Successfully created new labels.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (201)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST#body-structure-201)

 Expand all

results

array: object The label creation results.
id

string The label ID.
name

string The label name.
description

string The label description.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST#example)
Successfully Created the label(s) (201)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/labels' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '[
        {
          "name": "doors",
          "description": ""
        },
        {
          "name": "windows",
          "description": "all parameters that relate to window families"
        }
      ]'
```

Show More

### Response

```
{
  "results": [
    {
        "id": "ACMT-69415-CEVT-22201",
        "name": "doors",
        "description": ""
      },
      {
        "id": "ACNL-88665-BCSL-99749",
        "name": "windows",
        "description": "all parameters that relate to window families"
      }
    ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)


### GET Retrieve a label

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Retrieve information about the given label id.

GET

# v1/accounts/{accountId}/labels/{labelId}

Retrieve information about the given label id.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/labels/{labelId}
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
labelId

string The label ID.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#http-status-code-summary)

200

OK Successful retrieval of the label.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#body-structure-200)

id

string The label ID.
name

string The label name.
description

string The label description.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#example)
Successful retrieval of the label (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/labels/PQWJ-15400-I3YS-26764' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "id": "PQWJ-15400-I3YS-26764",
  "name": "doors",
  "description": "all parameters that relate to door families"
}
```

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#)

Review settings

CONTINUE TO SITE

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET#) to learn more about your options. 

YES Decline


### PATCH Modify a label

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Update information of a given label.

PATCH

# v1/accounts/{accountId}/labels/{labelId}

Update information of a given label.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#resource-information)

Method and URI PATCH

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/labels/{labelId}
Authentication Context user context required
Required OAuth Scopes`data:read data:write`
Data Format JSON

Note: Data will be updated according to the JSON Merge Patch protocol.

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
labelId

string The label ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#body-structure)

name

string The new label name.
description

string The new label description.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#http-status-code-summary)

200

OK Successfully updated the label.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#body-structure-200)

id

string The label ID.
name

string The label name.
description

string The label description.

Note:Update or Detach Labels APIs can update parameters outside the specified collection in certain instances.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#example)
Successfully updated the label (200)

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/labels/PQWJ-15400-I3YS-26764' \
  -X 'PATCH' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "name": "new doors",
        "description": "These are new doors"
      }'
```

Show More

### Response

```
{
  "id": "PQWJ-15400-I3YS-26764",
  "name": "new doors",
  "description": "These are new doors"
}
```

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH#) to learn more about your options. 

YES Decline


### DELETE Delete a label

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Deletes a label.

DELETE

# v1/accounts/{accountId}/labels/{labelId}

Deletes a Label. It can only be removed if the Label is not attached to any Parameter.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#resource-information)

Method and URI DELETE

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/labels/{labelId}
Authentication Context user context required
Required OAuth Scopes`data:write`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
labelId

string The label ID.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#http-status-code-summary)

204

No Content Successfully deleted the Label.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (204)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#body-structure-204)
Response for 204 has no body.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#example)
Successfully deleted the Label (204).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/labels/PQWJ-15400-I3YS-26764' \
  -X 'DELETE' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
204 No Content
```

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE#) to learn more about your options. 

YES Decline


### POST Attach labels to parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Attach a set of labels to a set of parameters within a given collection.

POST

# v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/labels:attach

Attach a set of labels to a set of parameters within a given collection.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/labels:attach
Authentication Context user context required
Required OAuth Scopes`data:write``data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
collectionId

string The collection ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#body-structure)

labelIds*

array: string The label IDs.
parameterIds*

array: string The parameter IDs.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#http-status-code-summary)

201

Created Successful attachment of Labels to Parameters.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (201)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#body-structure-201)

labelIds

array: string The label IDs.
parameterIds

array: string The parameter IDs.

Note: Attach Labels API will return a (201) response even if it returns with errors in the response instead of a (207)

Note: Update or Detach Labels APIs can update parameters outside the specified collection in certain instances.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#example)
Successful attachment of Labels to Parameters (201).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/009777bb-e1e5-4577-9800-0789677e4616/labels:attach' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "labelIds": [
          "ADGN-65851-BCYL-17514"
        ],
        "parameterIds": [
          "parameters.d05ec054ef8046ad9c80fc742f29027c:885621e67e7f4e49b9754b631ea476da-1.0.0"
        ]
      }'
```

Show More

### Response

```
{
  "labelIds": [
    "ADGN-65851-BCYL-17514"
  ],
  "parameterIds": [
    "parameters.d05ec054ef8046ad9c80fc742f29027c:885621e67e7f4e49b9754b631ea476da-1.0.0"
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST#) to learn more about your options. 

YES Decline


### POST Detach labels from parameters

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Detaches the labels from the parameters.

POST

# v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/labels:detach

Detaches the labels from the parameters.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#resource-information)

Method and URI POST

 https://developer.api.autodesk.com/parameters/v1/accounts/{accountId}/groups/{groupId}/collections/{collectionId}/labels:detach
Authentication Context user context required
Required OAuth Scopes`data:write`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Content-Type*

string Must be `application/json`
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [URI Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#uri-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID.
groupId

string The group ID. Currently, only one group is supported, and group id is equal to hub id. (Supporting multiple groups is considered for future enhancement).
collectionId

string The collection ID.

### Request

## [Body Structure](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#body-structure)

labelIds*

array: string The label IDs.
parameterIds*

array: string The parameter IDs.

* Required

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#http-status-code-summary)

201

No Content Successfully detached the Label from the designated parameters.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (201)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#body-structure-201)

labelIds

array: string The label IDs.
parameterIds

array: string The parameter IDs.

Note: Detach Labels API will return a (204) response even if it returns with errors in the response instead of a (207)

Note: Update or Detach Labels APIs can update parameters outside the specified collection in certain instances.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#example)
Successful detachment of the Label from the parameters (201).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/accounts/009777bb-e1e5-4577-9800-0789677e4616/groups/009777bb-e1e5-4577-9800-0789677e4616/collections/028b3307-91aa-45ec-864c-1c4af88b8a08/labels:detach' \
  -X 'POST' \
  -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
  -H 'Content-Type: application/json' \
  -d '{
        "labelIds": [
          "ADGN-65851-BCYL-17514"
        ],
        "parameterIds": [
          "parameters.009777bb-e1e5-4577-9800-0789677e4616:885621e67e7f4e49b9754b631ea476da-1.0.0"
        ]
      }'
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST#) to learn more about your options. 

YES Decline


---

## API Reference – Classifications


### GET Retrieve disciplines

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Lists disciplines.

GET

# v1/disciplines

Lists disciplines used in the system. Currently, disciplines used in Revit are included. For this endpoint, the user (authorization token) does not need access to a given Forma hub.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/disciplines
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#query-string-parameters)

offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
ids

string The discipline IDs split by comma. With this query parameter, you can get the specified disciplines in an array.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#http-status-code-summary)

200

OK Successful retrieval of the disciplines.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#body-structure-200)

 Expand all

pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.
results

array: object
id

string The discipline ID.
name

string The discipline name.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#example)
Successful retrieval of the disciplines (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/disciplines'
    -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
```

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 8
  },
  "results": [
    {
      "typeId": "autodesk.spec.discipline:architecture-1.0.0",
      "name": "Architecture"
    },
    {
      "typeId": "autodesk.spec.discipline:electrical-1.0.0",
      "name": "Electrical"
    },
    {
      "typeId": "autodesk.spec.discipline:energy-1.0.0",
      "name": "Energy"
    },
    {
      "typeId": "autodesk.spec.discipline:hvac-1.0.0",
      "name": "HVAC"
    },
    {
      "typeId": "autodesk.spec.discipline:infrastructure-1.0.0",
      "name": "Infrastructure"
    },
    {
      "typeId": "autodesk.spec.discipline:piping-1.0.0",
      "name": "Piping"
    },
    {
      "typeId": "autodesk.spec.discipline:structural-1.0.0",
      "name": "Structural"
    },
    {
      "typeId": "autodesk.spec:discipline-1.0.0",
      "name": "Common"
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET#) to learn more about your options. 

YES Decline


### GET Retrieve specs

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Lists parameter specs.

GET

# v1/specs

By default, lists parameter specs used in the system. Specs define data types and describe, for example, how data is stored and presented to the user. For more information about the definition of specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec). For this endpoint, the user (authorization token) does not need access to a given Forma hub.

If you provide a Forma hub ID in the request, the endpoint will return the user-defined specs to support enumerations. If you provide the Spec ID(s) in the request, the endpoint will return the Spec(s) with the provided ID(s). When using this endpoint with an Forma hub ID, the user must have access to the given Forma hub.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/specs
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#query-string-parameters)

accountId

string: UUID or string: b.UUID The Autodesk Forma hub ID. If not provided, will return specs used by the system. If provided, will return the user defined specs to support enumerations.
ids

string The Spec ID(s) that you would like to return, split by a comma. Providing no Spec ID will return all user-defined Specs in the Forma hub.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.

Note- To see what parameters are using an enumeration data type, use the Search Parameters API.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#http-status-code-summary)

200

OK Successful retrieval of the parameter specs used in the system.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410

Gone Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#body-structure-200)

 Expand all

pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.
results

array: object
id

string The spec ID.
name

string The user-facing name of the spec.
disciplineId

string The discipline ID. Look up detailed information in the response of the GET /disciplines API.
applicableUnitIds

array: string The identifiers of the units applicable to this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”.
storageUnitId

string The identifier of the storage unit of this spec. This field exists only for measurable specs that are associated with units of measurement, such as “Length” or “Acceleration”. It is null for non-measurable specs such as “Text” or “Yes/No”. The storage unit is the unit of measurement that quantifies values of this parameter in persistent storage. When writing parameter values, client applications must ensure that the values written are quantified according to each parameter’s storage unit. A unit conversion might be necessary if input values are quantified differently.
valueTypeId

string The identifier of the storage value type, which could be Bool, Int64, Float64, Reference, String or a type ID. Value Type IDs support version ranges. For more information about version ranges in specs, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#spec). Results are returned for the highest applicable Value Type Id version available.
context

string The value “single” indicates that the spec stores a single value. The value “array” indicates that the spec stores an array of values.
createdBy

string User that created the parameter.
createdAt

string A Time ISO 8601 Timestamp in UTC Timezone indicating when the parameter was created.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#example)
Successful retrieval of the specs (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs'
```

### Response

```
{
  "results": [
    {
      "id": "autodesk.spec.aec.structural:linearMomentScale-2.0.0",
      "name": "Linear Moment Scale",
      "disciplineId": "autodesk.spec.discipline:structural-1.0.0",
      "applicableUnitIds": [
        "autodesk.unit.unit:feetPerKip-1.0.0",
        "autodesk.unit.unit:metersPerKilonewton-1.0.0"
      ],
      "storageUnitId": "autodesk.unit.unit:metersPerKilonewton-1.0.0",
      "valueTypeId": "Float64",
      "context": "single",
      "createdBy": "System Generated",
      "createdAt": "System Generated"
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 1
  }
}
```

Show More

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/specs?accountId=b3aef626-f535-4c7a-a032-c1048416f5ea'
    -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a'
```

### Response

```
{
  "results": [
    {
      "id": "parameters.b3aef626f5354c7aa032c1048416f5ea:4abfb8015fc34e17816b64abe0522864-14.0.0",
      "name": "Multiple Select: Lunch Order Items",
      "disciplineId": "autodesk.spec:discipline-2.0.0",
      "applicableUnitIds": null,
      "storageUnitId": null,
      "valueTypeId": "parameters.b3aef626f5354c7aa032c1048416f5ea:ba31c7ca1b7842e282211830d7f6f5a7-17.0.0",
      "context": "array",
      "createdBy": "FXA2K4JGR5BECGSF",
      "createdAt": "2024-11-05T18:55:42+0000",
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 1
  }
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#)

Review settings

CONTINUE TO SITE

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET#) to learn more about your options. 

YES Decline


### GET Retrieve units

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Lists units.

GET

# v1/units

Lists units defined in the system. For more information about the definition of units in the Parameters API, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#unit). For this endpoint, the user (authorization token) does not need access to a given Forma hub.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/units
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#query-string-parameters)

offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
ids

string The unit IDs split by comma. With this query parameter, you can get the specified units in an array.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#http-status-code-summary)

200

OK Successful retrieval of the units defined in the system.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#body-structure-200)

 Expand all

pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.
results

array: object
id

string The unit ID.
name

string The unit name.
symbolIds

array: string The identifiers of symbols that indicate this unit in a written measurement, such as the “m” indicating “meters” in a written measurement such as “5m”. A unit of measurement may have zero, one, or many symbols available. Symbols may be used when rendering parameters.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#example)
Successful retrieval of the units (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/units'
    -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
```

### Response

```
{
  "pagination": {
    "totalResults": 311,
    "offset": 0,
    "limit": 50,
    "nextUrl": "https://developer.api.autodesk.com/parameters/v1/units?offset=50&limit=50"
  },
  "results": [
    {
      "id": "autodesk.unit.unit:1ToRatio-1.0.1",
      "name": "1 : Ratio",
      "symbolIds": [
        "autodesk.unit.symbol:1Colon-1.0.1"
      ]
    },
    {
      "id": "autodesk.unit.unit:acres-1.0.1",
      "name": "Acres",
      "symbolIds": [
        "autodesk.unit.symbol:acres-1.0.1"
      ]
    },
    {
      "id": "autodesk.unit.unit:amperes-1.0.0",
      "name": "Amperes",
      "symbolIds": [
        "autodesk.unit.symbol:ampere-1.0.0"
      ]
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET#) to learn more about your options. 

YES Decline


### GET Retrieve groups

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Lists classification groups.

GET

# v1/classifications/groups

List classification groups. Classification groups are used to organize a set of parameters applied to an object by further grouping together as a subset of parameters. For example, in Revit, a set of parameters applied to an element are grouped under Dimensions, Materials, and so on. Currently, only groups used in Revit are included. For more information about classification groups, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#classification-group) . For this endpoint, the user (authorization token) does not need access to a given Forma hub.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/classifications/groups
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#query-string-parameters)

offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
filter[bindable]

boolean Filters out the bindable items.
ids

string The group IDs split by comma. With this query parameter, you can get the specified groups in an array.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#http-status-code-summary)

200

OK Successful retrieval of the groups.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#body-structure-200)

 Expand all

pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.
results

array: object
id

string Identifier of the group. It must contain only alphanumeric characters or underscores and must have a length of at least 2 characters and no more than 64 characters.
name

string The group name.
bindingId

string The binding ID of this group. It is used to create parameters with group binding, which will help to organize the parameters in different groups in the application, like Revit. The group can’t be bound to any parameters if the bindingId is null.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#example)
Successful retrieval of the groups (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/classifications/groups'
    -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
```

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 3
  },
  "results": [
    {
      "typeId": "autodesk.parameter.group:adskModelProperties-1.0.0",
      "name": "Model Properties",
      "bindingId": "ABXZ-68714-GYLB-48622"
    },
    {
      "typeId": "autodesk.parameter.group:analysisResults-1.0.0",
      "name": "Analysis Results",
      "bindingId": "ABXZ-68714-GXQV-05589"
    },
    {
      "typeId": "autodesk.parameter.group:analyticalAlignment-1.0.0",
      "name": "Analytical Alignment",
      "bindingId": "ABXZ-68714-GKYQ-74544"
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET#) to learn more about your options. 

YES Decline


### GET Retrieve categories

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET)_

#### [Jump To](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET)

[Documentation](https://aps.autodesk.com/developer/documentation) / 

[Parameters API](https://aps.autodesk.com/en/docs/parameters/v1) / 

[API Reference](https://aps.autodesk.com/en/docs/parameters/v1/reference)

Lists categories.

GET

# v1/classifications/categories

List categories defined in the system. Categories can be found in various contexts. For example, in the context of building models - walls, columns, floors, etc. For annotations - room tags, area tags, sections, elevations, etc.

Current categories used in the Revit are supported. For more information about the definition of categories, please refer to the [Field Guide](https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide/#category). For this endpoint, the user (authorization token) does not need access to a given Forma hub.

## [Resource Information](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#resource-information)

Method and URI GET

 https://developer.api.autodesk.com/parameters/v1/classifications/categories
Authentication Context user context required
Required OAuth Scopes`data:read`
Data Format JSON

### Request

## [Headers](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#headers)

Authorization*

string Must be Bearer <token>, where <token> is obtained via a [three-legged](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/) OAuth flow.
Region

string The region the hub’s data is provisioned in. Currently supports `US`, `EMEA`, `AUS`, `IND`, `DEU`, `JPN`, `CAN`, and `GBR`. Default is `US`.

* Required

### Request

## [Query String Parameters](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#query-string-parameters)

offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
filter[bindable]

boolean Filters out the bindable items.
ids

string The category IDs split by comma. With this query parameter, you can get the specified categories in an array.

### Response

## [HTTP Status Code Summary](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#http-status-code-summary)

200

OK Successful retrieval of the categories.
400

Bad Request The request could not be understood by the server due to malformed syntax.
401

Unauthorized Request has not been applied because it lacks valid authentication credentials for the target resource.
403

Forbidden The server understood the request but refuses to authorize it.
404

Not Found The resource cannot be found.
406

Not Acceptable The server cannot produce a response matching the list of acceptable values defined in the request.
410 Access to the target resource is no longer available.
429

Too Many Requests User has sent too many requests in a given amount of time.
500

Internal Server Error An unexpected error occurred on the server.
503

Service Unavailable Server is not ready to handle the request.

### Response

## [Body Structure (200)](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#body-structure-200)

 Expand all

pagination

object The information for paginating records returned by the endpoint.
offset

int Offset from the start of the collection to the first entry in the page. Zero based.
limit

int Determines the maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
totalResults

int The total number of results that match the query irrespective of limit.
nextUrl

string Link that will return the next page of data. If not included, this is the last page of data.
results

array: object
id

string The category ID.
name

string The category name.
disciplineIds

array: string The discipline IDs of this category. Look up detailed information in the response of the GET /disciplines API.
parentCategoryId

string The parent category ID of this category.
bindingId

string The bindingId of this this category. It is used to create the parameters with categories, which will help to organize the parameters in different categories in the application, like Revit. The category can’t be bound to any parameters if the bindingId is null.

## [Example](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#example)
Successful retrieval of the categories (200).

### Request

```
curl -v 'https://developer.api.autodesk.com/parameters/v1/classifications/categories'
    -H 'Authorization: Bearer AuIPTf4KYLTYGVnOHQ0cuolwCW2a' \
```

### Response

```
{
  "pagination": {
    "offset": 0,
    "limit": 50,
    "totalResults": 207,
    "nextUrl": "https://developer.api.autodesk.com/parameters/v1/classifications/categories?offset=50&limit=50"
  },
  "results": [
    {
      "id": "autodesk.revit.category.family:abutmentFoundations-1.0.0",
      "name": "Abutment Foundations",
      "disciplineIds": null,
      "parentCategoryId": "autodesk.revit.category.family:bridgeAbutments-1.0.0",
      "bindingId": "ACFT-94206-BGDE-78534"
    },
    {
      "typeId": "autodesk.revit.category.family:abutmentPiles-1.0.0",
      "name": "Abutment Piles",
      "disciplineIds": null,
      "parentCategoryId": "autodesk.revit.category.family:bridgeAbutments-1.0.0",
      "bindingId": "ACFT-94206-BFTC-07019"
    }
  ]
}
```

Show More

[![Image 12: Autodesk](https://aps.autodesk.com/static/1.0.0.20260423154451/images/adsk-logo--black.svg)](https://www.autodesk.com/ "Autodesk")

[Company overview](https://www.autodesk.com/company)[Careers](https://www.autodesk.com/careers/overview)[Investor relations](https://investors.autodesk.com/)[Newsroom](https://adsknews.autodesk.com/)

Follow APS [Twitter](https://twitter.com/AutodeskAPS)[Facebook](https://www.facebook.com/AutodeskPlatformServices)

Solutions [AEC Data Model](https://aps.autodesk.com/autodesk-aec-data-model-api)[Autodesk Forma](https://aps.autodesk.com/developer/overview/forma)[Autodesk Fusion](https://aps.autodesk.com/fusion-industry-cloud)[Automation](https://aps.autodesk.com/automation-apis)[BIM 360](https://aps.autodesk.com/api/bim-360-cover-page/)[BuildingConnected API](https://aps.autodesk.com/buildingconnected-cover-page)[Data Exchange](https://aps.autodesk.com/data-exchange-cover-page)[Data Management](https://aps.autodesk.com/api/data-management-cover-page/)[Data Visualizations](https://aps.autodesk.com/data-visualization-cover-page/)[Flow Graph Engine API](https://aps.autodesk.com/flow-graph-engine-api)[Manufacturing Data Model](https://aps.autodesk.com/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/api/model-derivative-cover-page/)[Reality Capture](https://aps.autodesk.com/api/reality-capture-cover-page/)[Sustainability Data API](https://aps.autodesk.com/sustainability-data-api)[Tandem Data API](https://aps.autodesk.com/autodesk-tandem-data-api)[Token Flex](https://aps.autodesk.com/api/token-flex-cover-page)[Vault Data APIs](https://aps.autodesk.com/vault-data-apis)[Viewer](https://aps.autodesk.com/api/viewer-cover-page/)[Webhooks](https://aps.autodesk.com/api/webhooks-cover-page/)

Documentation [AEC Data Model](https://aps.autodesk.com/developer/overview/aec-data-model-api)[Authentication](https://aps.autodesk.com/en/docs/oauth/v2)[Automation](https://aps.autodesk.com/en/docs/design-automation/v3)[BIM 360](https://aps.autodesk.com/developer/overview/bim-360-api)[Data Exchange](https://aps.autodesk.com/en/docs/fdxgraph/v1/developers_guide/overview/)[Data Management](https://aps.autodesk.com/en/docs/data/v2)[Data Visualizations](https://aps.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/)[Flow Graph Engine API](https://aps.autodesk.com/developer/overview/flow-graph-engine-api)[Forma APIs](https://aps.autodesk.com/developer/overview/forma)[Manufacturing Data Model](https://aps.autodesk.com/developer/overview/manufacturing-data-model-api)[Model Derivative](https://aps.autodesk.com/en/docs/model-derivative/v2)[Reality Capture](https://aps.autodesk.com/en/docs/reality-capture/v1)[Sustainability Data API](https://aps.autodesk.com/en/docs/sustainability/v3/developers_guide/overview/)[Tandem Data API](https://aps.autodesk.com/en/docs/tandem/v1/)[Token Flex](https://aps.autodesk.com/en/docs/tokenflex/v1/)[Viewer](https://aps.autodesk.com/en/docs/viewer/v7)[Webhooks](https://aps.autodesk.com/en/docs/webhooks/v1)

Resources [Get Help](https://aps.autodesk.com/get-help)[API Status](https://aps.autodesk.com/en/support/api-status)[Blog](https://aps.autodesk.com/blog)[FAQ](https://www.autodesk.com/products/autodesk-platform-services/overview#faqs-panel)[Code Samples](https://aps.autodesk.com/code-samples)[ADN Member Sign-in](https://adn.autodesk.io/)[Get in Touch!](https://forge.autodesk.com/#newsletter)

About [About APS](https://aps.autodesk.com/)[Pricing](https://www.autodesk.com/products/autodesk-platform-services/overview#pricing)[Success Stories](https://aps.autodesk.com/success-stories)[Certified Partners](https://aps.autodesk.com/certified-partners)[Partnerships](https://aps.autodesk.com/partnerships)

[Privacy/Cookies ![Image 13](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/privacy)[Privacy Settings](javascript:;)[Do not sell or share my personal information](https://www.autodesk.com/company/legal-notices-trademarks/ccpa-do-not-sell)[Terms of Service ![Image 14](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services/forge-platform-web-services-api-terms-of-service)[Legal Notices & Trademarks ![Image 15](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/company/legal-notices-trademarks)[Report Noncompliance ![Image 16](https://aps.autodesk.com/static/1.0.0.20260423154451/images/icon-external.svg)](http://www.autodesk.com/reportpiracy)[© 2026 Autodesk Inc. All rights reserved.](https://aps.autodesk.com/)

 ______ 

![Image 17](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Cookie preferences

Your privacy is important to us and so is an optimal experience. To help us customize information and build applications, we collect data about your use of this site.
**May we collect and use your data?**

Learn more about the [Third Party Services](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#) we use and our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#). 

YES TO ALL NO TO ALL

#### Strictly necessary – required for our site to work and to provide services to you

These cookies allow us to record your preferences or login information, respond to your requests or fulfill items in your shopping cart.

- [x] YES 

#### Improve your experience – allows us to show you what is relevant to you

These cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we use to deliver information and experiences tailored to you. If you do not allow these cookies, some or all of these services may not be available for you.

YES 

NO 

#### Customize your advertising – permits us to offer targeted advertising to you

These cookies collect data about you based on your activities and interests in order to show you relevant ads and to track effectiveness. By collecting this data, the ads you see will be more tailored to your interests. If you do not allow these cookies, you will experience less targeted advertising.

YES 

NO 

CONTINUE TO SITE

**To change your settings later, click Privacy Settings at the bottom of any page.**

![Image 18](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## THIRD PARTY SERVICES

Learn more about the Third-Party Services we use in each category, and how we use the data we collect from you online.

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET#) to learn more about your options. 

YES Decline


---

## Change History


### Changelog

_Source: [https://aps.autodesk.com/en/docs/parameters/v1/change-history/changelog](https://aps.autodesk.com/en/docs/parameters/v1/change-history/changelog)_

# Changelog

**12-3-2025**

*   Updated description of parameter Read-Only metadata field.

**10-24-2025**

*   Added new region header options.

**8-12-2025**

*   Added APIs for working with enumerations and specs.
*   Added tutorial for creating enumerations.
*   Updated Field Guide for new uses of specs and enumerations.
*   Added AUS Region to the list of available regions.
*   Added details of the Batch Get Parameters API.
*   Added details of the Autodesk metadata that may be returned with a parameter.

**9-12-2024**

*   Added details of the joinConstructionData query parameter for GET: Retrieve Parameter Collections.

**6-26-2024**

*   Added details of the Region header to all APIs.
*   Added reminders to the API documentation to create parameters in the default collection to preserve UI behavior.

**5-22-2024**

*   Added a “valueTypeId” field to the response bodies of the GET parameters and POST parameters:search operations.

**4-12-2024**

*   Added information on how to setup your account to use the Parameters Service and Parameters API
*   Updated error responses to include more information on what went wrong: * Collection creation failed due to duplicated id/name * Errors when parameter validation fails * 401 instead of 500, when fetching groups on account you do not have permissions to access * Error when listing collections, when account is not activated

**3-6-2024**

*   Added ValueTypeId to the field guide for Specs
*   Made Batch Share and Un-share Parameters available to Public API

### Strictly necessary – required for our site to work and to provide services to you

**Qualtrics**

W

**Akamai mPulse**

W

**Digital River**

W

**Dynatrace**

W

**Khoros**

W

**Launch Darkly**

W

**New Relic**

W

**Salesforce Live Agent**

W

**Wistia**

W

**Tealium**

W

**Upsellit**

W

**CJ Affiliates**

W

**Commission Factory**

W

**Google Analytics (Strictly Necessary)**

W

**Typepad Stats**

W

**Geo Targetly**

W

**SpeedCurve**

W

**Qualified**

#

### Improve your experience – allows us to show you what is relevant to you

**Google Optimize**

W

**ClickTale**

W

**OneSignal**

W

**Optimizely**

W

**Amplitude**

W

**Snowplow**

W

**UserVoice**

W

**Clearbit**

#

**YouTube**

#

### Customize your advertising – permits us to offer targeted advertising to you

**Adobe Analytics**

W

**Google Analytics (Web Analytics)**

W

**AdWords**

W

**Marketo**

W

**Doubleclick**

W

**HubSpot**

W

**Twitter**

W

**Facebook**

W

**LinkedIn**

W

**Yahoo! Japan**

W

**Naver**

W

**Quantcast**

W

**Call Tracking**

W

**Wunderkind**

W

**ADC Media**

W

**AgrantSEM**

W

**Bidtellect**

W

**Bing**

W

**G2Crowd**

W

**NMPI Display**

W

**VK**

W

**Adobe Target**

W

**Google Analytics (Advertising)**

W

**Trendkite**

W

**Hotjar**

W

**6 Sense**

W

**Terminus**

W

**StackAdapt**

W

**The Trade Desk**

W

**RollWorks**

W

## Are you sure you want a less customized experience?

We can access your data only if you select "yes" for the categories on the previous screen. This lets us tailor our marketing so that it's more relevant for you. You can change your settings at any time by visiting our [privacy statement](https://aps.autodesk.com/en/docs/parameters/v1/change-history/changelog#)

Review settings

CONTINUE TO SITE

![Image 19](https://damassets.autodesk.net/content/dam/autodesk/logos/autodesk-logo-blk.svg)

## Your experience. Your choice.

We care about your privacy. The data we collect helps us understand how you use our products, what information you might be interested in, and what we can improve to make your engagement with Autodesk more rewarding. 
**May we collect and use your data to tailor your experience?**

 Explore the benefits of a customized experience by managing your [privacy settings](https://aps.autodesk.com/en/docs/parameters/v1/change-history/changelog#) for this site or visit our [Privacy Statement](https://aps.autodesk.com/en/docs/parameters/v1/change-history/changelog#) to learn more about your options. 

YES Decline
