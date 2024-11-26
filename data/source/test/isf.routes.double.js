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

