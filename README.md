# Future Home of XAP WS

## GOALS

 - provide a higher level API to functionality exposed by the XAP API. For example, low level calls expose the number of layers. XAP WS would present a higher level JSON document that contained a attribute the layers for that device.
 - Take advantage of lower level APIs in XAP to provide a higher level API surface for less sophisticated clients
 - listen to events of interest from XAP broadcasts and forward them to WS listeners

## ANTI GOALS

 - expose XAP API in all it's glory. Use the language bindings.
