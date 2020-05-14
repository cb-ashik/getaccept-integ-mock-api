const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');

app.use(cors()); // use CORS for all requests and all routes

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let currentStepIndex = 1;

const integSteps = [
    'INITIALIZATION',
    'CONNECT_QUOTE_TYPE',
    'CONNECT_SENDER_RULES',
    'CONNECT_SYNC_RULES',
    'COMPLETED',
];

let payload = {
    integrationName: 'getaccept',
    steps: integSteps,
    isNotAnGetAcceptAdmin: false,
    quoteTypeOption: {
        isDraft: false,
        isOverridable: true,
        value: null,
    },
    documentTypeOption: {
        isDraft: false,
        isOverridable: true,
        value: 'GETACCEPT_TEMPLATE',
    },
    templateOption: {
        isDraft: false,
        isOverridable: true,
        value: null,
        searchable: true,
        options: [
            {
                displayName: 'Quotes Template 1',
                description: 'Quotes / Quotes Template 1',
                value: 'qt1',
            },
            {
                displayName: 'Quotes Template 2',
                description: 'Quotes / Quotes Template 2',
                value: 'qt2',
            },
            {
                displayName: 'Quotes Template X',
                description: 'Quotes / Quotes Template x',
                value: 'qtx',
            },
        ],
    },
    isAttachChargebeeQuote: {
        isDraft: false,
        isOverridable: true,
        value: true,
    },
    defaultSenderOption: {
        isDraft: false,
        isOverridable: true,
        value: null,
        searchable: true,
        options: [
            {
                displayName: 'Ashik Nesin',
                description: 'mail@ashiknesin.com',
                value: 'an',
            },
            {
                displayName: 'Quotes Template 2',
                description: 'Quotes / Quotes Template 2',
                value: 'qt2',
            },
            {
                displayName: 'Quotes Template X',
                description: 'Quotes / Quotes Template x',
                value: 'qtx',
            },
        ],
    },
    isAllowOnlyDefaultSender: {
        isDraft: false,
        isOverridable: true,
        value: true,
    },
    actionOnSignOption: {
        isDraft: false,
        value: null,
        isOverridable: true,
    },
    isDeletePreviousVersions: {
        isDraft: false,
        value: false,
        isOverridable: true,
    },
    isFeatureAllowed: false,
    isUnlinkAllowed: true,
    dashboardOverview: {
        connectedOn: 1589214997720,
    },
    allowProceed: true,
    proceedBtnTooltip:
        'You must map all GetAccept fields to Chargebee quote fields to proceed.',
    isDraft: false,
    errorAlerts: ['TEMPLATE_UNAVAILABLE', 'SENDER_UNAVAILABLE'],
    getAcceptFieldsOption: {
        isDraft: false,
        options: [
            {
                displayName: 'Customer Company',
                value: 'ga_cc',
                cbQuoteFieldValue: 'cb_rc',
            },
            {
                displayName: 'Recipient First Name',
                value: 'ga_rfa',
                cbQuoteFieldValue: null,
            },
            {
                displayName: 'Document Number',
                value: 'ga_dn',
                cbQuoteFieldValue: null,
            },
        ],
    },
    cbQuoteFieldsOption: {
        options: [
            {
                displayName: 'Recipient Company',
                value: 'cb_rc',
            },
            {
                displayName: 'Customer First Name',
                value: 'cb_cfn',
            },
            {
                displayName: 'Quote ID',
                value: 'cb_qi',
            },
        ],
    },
};

const sendViaGetAcceptPayload = {
    quoteTypeOption: {
        value: 'DETAILED',
        options: [
            {
                displayName: 'Consolidated',
                description:
                    'Send quotes with the summary of all charges applicable through the lifetime of the subscription.',
                value: 'CONSOLIDATED',
                tag: 'Default',
                hideHeading: 'hideHeading',
            },
            {
                displayName: 'Detailed',
                value: 'DETAILED',
                description:
                    'Send quotes with a detailed view of the charges applicable for every billing cycle through the lifetime of the subscription.',
            },
        ],
    },
    templateName: 'Proposal Document Jan-2020',
    senderOption: {
        value: 'rn',
        searchable: true,
        options: [
            {
                displayName: 'Ashik Nesin',
                email: 'mail@ashiknesin.com',
                value: 'an',
            },
            {
                displayName: 'RN',
                email: 'rn@nesin.io',
                value: 'rn',
            },
        ],
    },
    isRestrictedSender: false,
    actionOnSignOption: {
        value: 'MARK_QUOTE_AND_CREATE_SUB',
        options: [
            {
                displayName: 'Mark quote as ‘Accepted’',
                description:
                    'Once a quote is signed, it will be marked as ‘Accepted’ in Chargebee. You need to manually create a subscription for the quote.',
                value: 'MARK_QUOTE_AS_ACCEPTED',
            },
            {
                displayName:
                    'Mark quote as ‘Accepted’ and create a subscription in Chargebee',
                description:
                    "Once a quote is signed. it will be marked as 'Accepted' and a subscription will be automatically created in Chargebee, with auto-collection turned off.",
                value: 'MARK_QUOTE_AND_CREATE_SUB',
            },
        ],
    },
    roleOption: {
        options: [
            {
                displayName: `Owner 'Signer'`,
                value: 'owner_signer',
            },
            {
                displayName: `Finance Controller 'Approver'`,
                value: 'finance_controller_approver',
            },
            {
                displayName: `Partner 'Only view'`,
                value: 'partner_only_view',
            },
        ],
    },
    allowProceed: true,
    errorAlerts: ['TEMPLATE_UNAVAILABLE'],
};

/* home route */
app.get('/', (req, res, next) => {
    res.send('hello there');
});

app.get('/third_party/ui/getaccept', (req, res) => {
    res.send({ ...payload, step: integSteps[currentStepIndex] });
});

app.get('/getaccept/send_via_get_accept', (req, res) => {
    res.send(sendViaGetAcceptPayload);
});

app.post('/third_party/ui/getaccept/stage', (req, res) => {
    currentStepIndex += 1;
    res.send({ ...payload, step: integSteps[currentStepIndex] });
});

app.post('/third_party/ui/getaccept/save', (req, res) => {
    payload = {
        ...payload,
        [req.body.prefName]: {
            ...payload[req.body.prefName],
            value: req.body.value,
            isDraft: false,
            isOverridable: true,
        },
    };

    if (req.body.prefName === 'cbGAFieldMapper') {
        payload.getAcceptFieldsOption.options = payload.getAcceptFieldsOption.options.map(
            item => {
                if (item.value === req.body.value.getAcceptFieldValue) {
                    item.cbQuoteFieldValue = req.body.value.cbQuoteFieldValue;
                }
                return item;
            }
        );
    }
    res.send({ ...payload, step: integSteps[currentStepIndex] });
});

app.post('/third_party/ui/getaccept/save_draft', (req, res) => {
    res.send({ ...payload, step: integSteps[currentStepIndex] });
});

/* start the app */
const port = process.env.PORT || 7777;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
