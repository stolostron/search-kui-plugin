/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

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
    query: 'query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    count\n    items\n    related {\n      kind\n      count\n      items\n      __typename\n    }\n    __typename\n  }\n}\n',
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

export const SEARCH_MCM_QUERY = (record) => {
  return {
    operationName: 'getResource',
    variables: {
        kind: record.kind,
        name: record.name,
        namespace: record.namespace,
        cluster: record.cluster,
        selfLink: record.selfLink,
      },
    query: 'query getResource($kind: String, $name: String, $namespace: String, $cluster: String, $selfLink: String) {\n  getResource(kind: $kind, name: $name, namespace: $namespace, cluster: $cluster, selfLink: $selfLink)\n}\n',
  }
}

export const SAVED_SEARCH_QUERY = {
  operationName: 'userQueries',
  variables: {},
  query: 'query userQueries {\n items: userQueries {\n name\n description\n searchText\n __typename\n}\n}\n',
}

export const SEARCH_SAVED_QUERY = {
  operationName: 'savedSearches',
  variables: {},
  query: 'query savedSearches {\n  items: savedSearches {\n    id\n    name\n    description\n    searchText\n    __typename\n  }\n}\n',
}

export const SAVED_QUERY = (search) => {
  return{
    operationName: 'saveQuery',
    variables: {
      resource: {
        name: search.name,
        description: search.description,
        searchText: search.searchText,
        id: search.id
      }
    },
    query: 'mutation saveQuery($resource: JSON!) {\n  saveQuery(resource: $resource)\n}\n'
  }
}

export const UPDATE_RESOURCE = (resource)=> {
  return {
    operationName: 'updateResource',
    variables: {
      body: resource,
      cluster: resource.cluster,
      kind: resource.kind,
      name: resource.name,
      namespace: resource.namespace,
      selfLink: resource.selfLink,
    },
    query: 'query updateResource($selfLink: String, $namespace: String, $kind: String, $name: String, $body: JSON, $cluster: String) {\n  updateResource(selfLink: $selfLink, namespace: $namespace, kind: $kind, name: $name, body: $body, cluster: $cluster)\n}\n',
  }
}

export const RESOURCE_LOGS = (record) => {
  return {
    operationName:'getLogs',
    variables: {
      containerName: record.container,
      podName: record.name,
      podNamespace: record.namespace,
      clusterName: record.cluster
    },
    query: 'query getLogs($containerName: String!, $podName: String!, $podNamespace: String!, $clusterName: String!) {\n  logs(containerName: $containerName, podName: $podName, podNamespace: $podNamespace, clusterName: $clusterName)\n}\n'
  }
}

export const DELETE_QUERY = (name) => {
  return {
    operationName: 'deleteQuery',
    query: 'mutation deleteQuery($resource: JSON!) {\n deleteQuery(resource: $resource)\n}\n',
    variables: {
      resource: {
        name,
      },
    },
  }
}

export const DELETE_RESOURCE = (name, namespace, kind, cluster, selfLink) => {
  return {
    operationName: 'deleteResource',
      query: 'mutation deleteResource($selfLink: String, $name: String, $namespace: String, $cluster: String, $kind: String, $childResources: JSON) {\ndeleteResource(selfLink: $selfLink, name: $name, namespace: $namespace, cluster: $cluster, kind: $kind, childResources: $childResources)\n}\n',
      variables: {
        // TODO - Not sure if child resources are handled at all..
        // childResources,
        name,
        namespace,
        kind,
        cluster,
        selfLink,
      },
  }
}
