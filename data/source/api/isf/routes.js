import dcUtils from '@DigitalColleagues/dc-utils'
import validate from '@DigitalColleagues/express-validate-schema'

import authorization from '../../common/middlewares/authorization.js'
import httpEventAdaptor from '../../common/http-event-adaptor.js'
import httpServer from '../../common/http-server.js'
import envQuery from '../../common/env-query.js'

// Command handlers
import startPick from '../../commands/start-pick/index.js'
import pausePick from '../../commands/pause-pick/index.js'
import resumePick from '../../commands/resume-pick/index.js'
import updatePickLine from '../../commands/update-pick-line/index.js'
import completePick from '../../commands/complete-pick/index.js'
import startLocating from '../../commands/start-locating/index.js'
import completeLocating from '../../commands/complete-locating/index.js'
import locatePickLine from '../../commands/locate-pick-line/index.js'
import delocatePick from '../../commands/delocate-pick/index.js'
import delocatePickLines from '../../commands/delocate-pick-lines/index.js'
import collectPick from '../../commands/collect-pick/index.js'
import exitPick from '../../commands/exit-pick/index.js'
import dispatchPick from '../../commands/dispatch-pick/index.js'
import startAmendment from '../../commands/start-amendment/index.js'
import pauseAmendment from '../../commands/pause-amendment/index.js'
import completeAmendment from '../../commands/complete-amendment/index.js'
import createParcel from '../../commands/create-parcel/index.js'
import createStoreDonation from '../../commands/create-store-donation/index.js'
import unpickPickLines from '../../commands/unpick-pick-lines/index.js'
// Command handlers (Order Management testing)
import createPick from '../../commands/create-pick/index.js'
import settlePayment from '../../commands/settle-payment/index.js'
import cancelPick from '../../commands/cancel-pick/index.js'
import expirePick from '../../commands/expire-pick/index.js'
import refundPick from '../../commands/refund-pick/index.js'
import amendPickLines from '../../commands/amend-pick-lines/index.js'
import updateCarrierDetails from '../../commands/update-carrier-details/index.js'
// Query handlers
import pickDetails from '../../queries/pick-details/index.js'
import picklist from '../../queries/picklist/index.js'
import orderDetails from '../../queries/order-details/index.js'
import pickLineLocations from '../../queries/pick-line-locations/index.js'
import biOrderDetails from '../../queries/bi/order-details/index.js'
import pickCounts from '../../queries/pick-counts/index.js'
import amendmentDetails from '../../queries/amendment-details/index.js'
import amendmentList from '../../queries/amendment-list/index.js'
import orderAmendmentDetails from '../../queries/order-amendment-details/index.js'
import parcelLabels from '../../queries/parcel-labels/index.js'
import parcels from '../../queries/order-parcels/index.js'
import config from '../../../config/index.js'

const { auth, appVersionAccepted, session, name: serviceName, trusts } = config
const {
  middlewares: {
    asyncServiceWrapper,
    createSapiHeaders,
    validation
  },
  lib: { swaggify }
} = dcUtils

const { app } = httpServer.setup()

// Commands (Digital Colleague)
httpServer.router.post(
  '/command/pick/:pickId/start-pick',
  ...validation({ appVersionAccepted, auth }),
  validate().params(startPick.schema.request.params),
  validate().body(startPick.schema.request.body),
  asyncServiceWrapper(startPick.handler))

httpServer.router.post(
  '/command/pick/:pickId/pause-pick',
  ...validation({ appVersionAccepted, auth }),
  validate().params(pausePick.schema.request.params),
  validate().body(pausePick.schema.request.body),
  asyncServiceWrapper(pausePick.handler))

httpServer.router.post(
  '/command/pick/:pickId/exit-pick',
  ...validation({ appVersionAccepted, auth }),
  asyncServiceWrapper(exitPick.handler))

httpServer.router.post(
  '/command/pick/:pickId/resume-pick',
  ...validation({ appVersionAccepted, auth }),
  asyncServiceWrapper(resumePick.handler))

httpServer.router.post(
  '/command/pick/:pickId/line/:pickLineId/update-pick-line',
  ...validation({ appVersionAccepted, auth }),
  validate().params(updatePickLine.schema.request.params),
  asyncServiceWrapper(updatePickLine.handler))

httpServer.router.post(
  '/command/pick/:pickId/complete-pick',
  ...validation({ appVersionAccepted, auth }),
  validate().params(completePick.schema.request.params),
  validate().body(completePick.schema.request.body),
  validate().response(completePick.schema.response),
  asyncServiceWrapper(completePick.handler))

httpServer.router.post(
  '/command/pick/:pickId/start-locating',
  ...validation({ appVersionAccepted, auth }),
  asyncServiceWrapper(startLocating.handler))

httpServer.router.post(
  '/command/pick/:pickId/complete-locating',
  ...validation({ appVersionAccepted, auth }),
  validate().params(completeLocating.schema.request.params),
  validate().body(completeLocating.schema.request.body),
  asyncServiceWrapper(completeLocating.handler))

httpServer.router.post(
  '/command/pick-location/locate-pick-line/:aisle/:bay/:bin',
  ...validation({ appVersionAccepted, auth }),
  asyncServiceWrapper(locatePickLine.handler))

httpServer.router.post(
  '/command/pick/:pickId/delocate-pick',
  ...validation({ appVersionAccepted, auth }),
  asyncServiceWrapper(delocatePick.handler))

httpServer.router.post(
  '/command/pick/:pickId/manual-delocate-pick',
  authorization(trusts.internal),
  asyncServiceWrapper(delocatePick.handler))

httpServer.router.post(
  '/command/pick/:pickId/collect-pick',
  ...validation({ appVersionAccepted, auth }),
  validate().body(collectPick.schema.body),
  asyncServiceWrapper(collectPick.handler))

httpServer.router.post(
  '/command/pick/:pickId/create-parcel',
  ...validation({ appVersionAccepted, auth }),
  validate().params(createParcel.schema.request.params),
  validate().body(createParcel.schema.request.body),
  validate().response(createParcel.schema.response),
  asyncServiceWrapper(createParcel.handler)
)

httpServer.router.post(
  '/command/pick/dispatch-pick',
  ...validation({ appVersionAccepted, auth }),
  createSapiHeaders({ sessionName: session.name }),
  validate().body(dispatchPick.schema.request.body),
  validate().response(dispatchPick.schema.response),
  asyncServiceWrapper(dispatchPick.handler))

httpServer.router.post(
  '/command/amendment/:amendmentId/start-amendment',
  ...validation({ appVersionAccepted, auth }),
  validate().params(startAmendment.schema.request.params),
  validate().body(startAmendment.schema.request.body),
  asyncServiceWrapper(startAmendment.handler))

httpServer.router.post(
  '/command/amendment/:amendmentId/pause-amendment',
  ...validation({ appVersionAccepted, auth }),
  validate().params(pauseAmendment.schema.request.params),
  validate().body(pauseAmendment.schema.request.body),
  asyncServiceWrapper(pauseAmendment.handler))

httpServer.router.post(
  '/command/amendment/:amendmentId/complete-amendment',
  ...validation({ appVersionAccepted, auth }),
  validate().params(completeAmendment.schema.request.params),
  validate().body(completeAmendment.schema.request.body),
  asyncServiceWrapper(completeAmendment.handler))

httpServer.router.post(
  '/command/amendment/delocate-pick-lines',
  ...validation({ appVersionAccepted, auth }),
  validate().body(delocatePickLines.schema.request.body),
  asyncServiceWrapper(delocatePickLines.handler)
)

httpServer.router.post(
  '/command/amendment/unpick-pick-lines',
  ...validation({ appVersionAccepted, auth }),
  validate().body(unpickPickLines.schema.request.body),
  asyncServiceWrapper(unpickPickLines.handler)
)

httpServer.router.post(
  '/command/carrier-details/update',
  authorization(trusts.external),
  validate().body(updateCarrierDetails.schema.request.body),
  validate().response(updateCarrierDetails.schema.response),
  asyncServiceWrapper(updateCarrierDetails.handler))

httpServer.router.post(
  '/command/create-store-donation',
  authorization(trusts.internal),
  asyncServiceWrapper(createStoreDonation.handler))

if (envQuery.isTesting) {
  httpServer.router.post(
    '/command/pick/create-pick',
    ...validation({ appVersionAccepted, auth }),
    asyncServiceWrapper(httpEventAdaptor(createPick.handler)))

  httpServer.router.post(
    '/command/pick/cancel-pick',
    ...validation({ appVersionAccepted, auth }),
    asyncServiceWrapper(httpEventAdaptor(cancelPick.handler)))

  httpServer.router.post(
    '/command/pick/expire-pick',
    ...validation({ appVersionAccepted, auth }),
    asyncServiceWrapper(httpEventAdaptor(expirePick.handler)))

  httpServer.router.post(
    '/command/pick/settle-payment',
    ...validation({ appVersionAccepted, auth }),
    asyncServiceWrapper(httpEventAdaptor(settlePayment.handler)))

  httpServer.router.post(
    '/command/pick/refund-pick',
    ...validation({ appVersionAccepted, auth }),
    asyncServiceWrapper(httpEventAdaptor(refundPick.handler)))

  httpServer.router.post(
    '/command/pick/amend-pick-lines',
    ...validation({ appVersionAccepted, auth }),
    asyncServiceWrapper(httpEventAdaptor(amendPickLines.handler)))
}

// Queries
httpServer.router.get(
  '/query/order/:orderNumber',
  ...validation({ appVersionAccepted, auth }),
  createSapiHeaders({ sessionName: session.name }),
  validate().query(orderDetails.schema.request.query),
  validate().params(orderDetails.schema.request.params),
  validate().response(orderDetails.schema.response),
  asyncServiceWrapper(orderDetails.handler)
)

httpServer.router.get(
  '/query/pick-line-locations',
  ...validation({ appVersionAccepted, auth }),
  validate().params(pickLineLocations.schema.request.params),
  validate().response(pickLineLocations.schema.response),
  asyncServiceWrapper(pickLineLocations.handler)
)

httpServer.router.get(
  '/query/pick/:pickId',
  ...validation({ appVersionAccepted, auth }),
  createSapiHeaders({ sessionName: session.name }),
  validate().query(pickDetails.schema.request.query),
  validate().params(pickDetails.schema.request.params),
  validate().response(pickDetails.schema.response),
  asyncServiceWrapper(pickDetails.handler)
)

httpServer.router.get(
  '/query/picklist',
  ...validation({ appVersionAccepted, auth }),
  createSapiHeaders({ sessionName: session.name }),
  validate().query(picklist.schema.request.query),
  validate().response(picklist.schema.response),
  asyncServiceWrapper(picklist.handler)
)

httpServer.router.get(
  '/query/pick-counts',
  ...validation({ appVersionAccepted, auth }),
  createSapiHeaders({ sessionName: session.name }),
  validate().query(pickCounts.schema.request.query),
  validate().response(pickCounts.schema.response),
  asyncServiceWrapper(pickCounts.handler)
)

// amendments
httpServer.router.get(
  '/query/amendment/:amendmentId',
  ...validation({ appVersionAccepted, auth }),
  validate().params(amendmentDetails.schema.request.params),
  validate().query(amendmentDetails.schema.request.query),
  validate().response(amendmentDetails.schema.response),
  asyncServiceWrapper(amendmentDetails.handler)
)

httpServer.router.get(
  '/query/amendment-list',
  ...validation({ appVersionAccepted, auth }),
  validate().query(amendmentList.schema.request.query),
  validate().response(amendmentList.schema.response),
  asyncServiceWrapper(amendmentList.handler)
)

httpServer.router.get(
  '/query/order-amendment/:orderId',
  ...validation({ appVersionAccepted, auth }),
  createSapiHeaders({ sessionName: session.name }),
  validate().params(orderAmendmentDetails.schema.request.params),
  validate().query(orderAmendmentDetails.schema.request.query),
  validate().response(orderAmendmentDetails.schema.response),
  asyncServiceWrapper(orderAmendmentDetails.handler)
)

// @gcms
httpServer.router.get(
  '/query/parcel-labels',
  ...validation({ appVersionAccepted, auth }),
  validate().query(parcelLabels.schema.request.query),
  validate().response(parcelLabels.schema.response),
  asyncServiceWrapper(parcelLabels.handler)
)

httpServer.router.get(
  '/query/parcels/:salesOrderId',
  ...validation({ appVersionAccepted, auth }),
  validate().params(parcels.schema.request.params),
  validate().response(parcels.schema.response),
  asyncServiceWrapper(parcels.handler)
)

// @biBods
httpServer.router.get(
  '/query/bi/order-details',
  authorization(trusts.external),
  validate().query(biOrderDetails.schema.request.query),
  validate().response(biOrderDetails.schema.response),
  asyncServiceWrapper(biOrderDetails.handler)
)

swaggify.setup(httpServer.router, {
  title: `Digital Colleague: ${serviceName}`
})

export default {
  app,
  httpServer
}
