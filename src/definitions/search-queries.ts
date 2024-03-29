/*******************************************************************************
* 
* Copyright (c) 2020 Red Hat, Inc.
* 
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
// Copyright Contributors to the Open Cluster Management project

export const GET_SEARCH_SCHEMA = {
  operationName: 'searchSchema',
  variables: {},
  query: 'query searchSchema {\n  searchSchema\n  }',
}

export const GET_SEARCH_COMPLETE = (property, query) => {
  return {
    operationName: 'searchComplete',
    variables: {
      property,
      query,
    },
    query: 'query searchComplete($property: String!, $query: SearchInput) {\n  searchComplete(property: $property, query: $query)\n }',
  }
}

export const SEARCH_RELATED_QUERY = (keywords, filters) => {
  return {
    operationName: 'searchResult',
    variables: {
     input: [{ keywords, filters }],
    },
    query: 'query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    items\n    related {\n      kind\n      items\n      __typename\n    }\n    __typename\n  }\n}\n',
  }
}

export const SEARCH_QUERY = (keywords, filters) => {
  return {
    operationName: 'searchResult',
    variables: {
      input: [{ keywords, filters }],
    },
    query: 'query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    items\n    __typename\n  }\n}\n',
  }
};

export const SEARCH_QUERY_COUNT = (input) => {
  return {
    operationName: 'searchResult',
    variables: {
      input,
    },
    query: 'query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    count\n    __typename\n  }\n}\n',
  }
}

export const SEARCH_ACM_QUERY = (record) => {
  return {
    operationName: 'getResource',
    variables: {
        kind: record.kind,
        name: record.name,
        namespace: record.namespace,
        cluster: record.cluster,
        apiVersion: record.apiversion,
      },
    query: 'query getResource($kind: String, $name: String, $namespace: String, $cluster: String, $apiVersion: String) {\n  getResource(kind: $kind, name: $name, namespace: $namespace, cluster: $cluster, apiVersion: $apiVersion)\n}\n',
  }
}

export const SAVED_SEARCH_QUERY = {
  operationName: 'savedSearches',
  variables: {},
  query: 'query savedSearches {\n  items: savedSearches {\n    id\n    name\n    description\n    searchText\n    __typename\n  }\n}\n',
}

export const SAVE_SEARCH = (search) => {
  return {
    operationName: 'saveSearch',
    variables: {
      resource: {
        id: search.id,
        name: search.name,
        description: search.description,
        searchText: search.searchText,
      },
    },
    query: 'mutation saveSearch($resource: JSON!) {\n  saveSearch(resource: $resource)\n}\n'
  }
}

export const UPDATE_RESOURCE = (body, data) => {
 return {
    operationName: 'updateResource',
    variables: {
      body,
      cluster: data.cluster,
      kind: `${data.kind}s`,
      name: data.name,
      namespace: data.namespace,
      apiVersion: data.apiversion,
    },
    query: 'query updateResource($apiVersion: String, $namespace: String, $kind: String, $name: String, $body: JSON, $cluster: String) {\n  updateResource(apiVersion: $apiVersion, namespace: $namespace, kind: $kind, name: $name, body: $body, cluster: $cluster)\n}\n',
  }
}

export const RESOURCE_LOGS = (record) => {
  return {
    operationName: 'getLogs',
    variables: {
      containerName: record.container,
      podName: record.name,
      podNamespace: record.namespace,
      clusterName: record.cluster,
    },
    query: 'query getLogs($containerName: String!, $podName: String!, $podNamespace: String!, $clusterName: String!) {\n  logs(containerName: $containerName, podName: $podName, podNamespace: $podNamespace, clusterName: $clusterName)\n}\n',
  }
}

export const DELETE_QUERY = (name) => {
  return {
    operationName: 'deleteSearch',
    query: 'mutation deleteSearch($resource: JSON!) {\n deleteSearch(resource: $resource)\n}\n',
    variables: {
      resource: {
        name,
      },
    },
  }
}

export const DELETE_RESOURCE = (name, namespace, kind, cluster, apiVersion) => {
  return {
    operationName: 'deleteResource',
      query: 'mutation deleteResource($apiVersion: String, $name: String, $namespace: String, $cluster: String, $kind: String, $childResources: JSON) {\n  deleteResource(apiVersion: $apiVersion, name: $name, namespace: $namespace, cluster: $cluster, kind: $kind, childResources: $childResources)\n}\n',
      variables: {
        name,
        namespace,
        kind,
        cluster,
        apiVersion,
      },
  }
}
