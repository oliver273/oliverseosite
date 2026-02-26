# Vapi Workflow Examples — Reference Templates

These are 3 pre-built Vapi workflow templates for reference when building our own workflows.
Use these to understand the structure: nodes, edges, conditions, variable extraction, global nodes, and tool nodes.

---

## Key Patterns to Learn From

### Node Types
- **`conversation`** — AI talks to the caller, can extract variables
- **`tool`** — Executes an action (endCall, transferCall)

### Edge Conditions
- All examples use `"type": "ai"` conditions with natural language prompts
- The AI evaluates whether the condition is met based on the conversation

### Variable Extraction
- Variables are extracted per-node using `variableExtractionPlan`
- Extracted variables can be referenced in later nodes using `{{variable_name}}`
- Variables have types: `string`, `number`, and optional `enum` for constrained values

### Global Nodes
- `globalNodePlan.enabled: true` makes a node accessible from ANY point in the conversation
- Used for "user wants to speak to a human" — always available regardless of current flow position

### Tool Nodes
- `endCall` — Ends the call with a final message (`blocking: true` ensures message plays before hangup)
- `transferCall` — Transfers to a human (requires `destinations` to be configured)

### First Messages
- Set in `messagePlan.firstMessage` on the start node
- The `isStart: true` flag marks which node begins the flow

---

## Template 1: Lead Qualification Agent

**Use case:** Outbound sales calls — qualify leads, discover needs, route to sales or nurture
**Nodes:** 11 (8 conversation + 1 transfer + 2 tool)
**Flow:** Introduction → Need Discovery → Solution Alignment → Qualification → Handoff/Nurture/Unqualified

```json
{
  "name": "Lead Qualification Agent",
  "nodes": [
    {
      "name": "introduction",
      "type": "conversation",
      "isStart": true,
      "metadata": {
        "position": {
          "x": -400,
          "y": -100
        }
      },
      "prompt": "You are Morgan from GrowthPartners. Start with: 'Hello, this is Morgan from GrowthPartners. We help businesses improve their operational efficiency through custom software solutions. Do you have a few minutes to chat about how we might be able to help your business?' Use a friendly, consultative tone.",
      "messagePlan": {
        "firstMessage": "Hello, this is Morgan from GrowthPartners. Do you have a few minutes to chat about how we might be able to help your business?"
      }
    },
    {
      "name": "need_discovery",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 122.06055576907863,
          "y": 370.339156111954
        }
      },
      "prompt": "Conduct need discovery by asking about: 1) Their business and industry, 2) Current systems/processes they use, 3) Biggest challenges with current approach, 4) How challenges affect operations/bottom line, 5) Previous solutions tried. Ask one question at a time, listen actively, and acknowledge their responses. Keep responses under 30 words unless providing valuable information.",
      "variableExtractionPlan": {
        "output": [
          {
            "type": "string",
            "title": "industry",
            "description": "the user's industry or business type"
          },
          {
            "type": "string",
            "title": "company_size",
            "description": "approximate number of employees or company size indicators"
          },
          {
            "type": "string",
            "title": "pain_points",
            "description": "main business challenges or pain points mentioned"
          },
          {
            "type": "string",
            "title": "current_systems",
            "description": "current systems or processes they use"
          }
        ]
      }
    },
    {
      "name": "solution_alignment",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 125.63713417374936,
          "y": 905.3346543965437
        }
      },
      "prompt": "Based on their pain points ({{pain_points}}) and industry ({{industry}}), highlight relevant GrowthPartners capabilities. Mention specific solutions: OperationsOS for workflow automation, InsightAnalytics for data analysis, or CustomerConnect for client relationship management. Share a relevant success story from a similar company. Explain key differentiators like customization, implementation support, and integration capabilities. Be brief."
    },
    {
      "name": "qualification_assessment",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 126.06167068192559,
          "y": 1470.257255047713
        }
      },
      "prompt": "Assess qualification by asking about: 1) Timeline for implementing a solution, 2) Budget allocation for this area, 3) Who else would be involved in evaluation, 4) How they would measure success. Listen for indicators that they meet our ideal customer profile: 50+ employees, $5M+ revenue, growth challenges, and willingness to invest in process improvement.\n\nExtract variables as users provide additional information",
      "variableExtractionPlan": {
        "output": [
          {
            "type": "string",
            "title": "timeline",
            "description": "their timeline for implementing a solution"
          },
          {
            "type": "string",
            "title": "budget_status",
            "description": "information about budget allocation or financial capacity"
          },
          {
            "type": "string",
            "title": "decision_makers",
            "description": "who else is involved in the decision process"
          },
          {
            "type": "string",
            "title": "success_criteria",
            "description": "how they would measure success of a solution"
          }
        ]
      }
    },
    {
      "name": "qualified_handoff",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 9.720369487897784,
          "y": 2193.2384478593317
        }
      },
      "prompt": "For qualified users, say: 'Based on our conversation, I think it would be valuable to have you speak with [appropriate sales representative], who specializes in [relevant area]. They can provide a more tailored overview of how we could help with [specific challenges mentioned]. Would you be available for a 30-minute call this week?' Suggest specific times and get their contact information.",
      "variableExtractionPlan": {
        "output": [
          {
            "type": "string",
            "title": "contact_email",
            "description": "user's email address"
          },
          {
            "type": "string",
            "title": "preferred_meeting_time",
            "description": "their preferred time for the sales meeting"
          }
        ]
      }
    },
    {
      "name": "nurture_prospect",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -604.7161537968582,
          "y": 2059.055679472908
        }
      },
      "prompt": "For users needing nurturing, say: 'It sounds like the timing might not be ideal right now. Would it be helpful if I sent you some information about how we've helped similar businesses in your industry? Then perhaps we could reconnect in [appropriate timeframe].' Get their email and set expectations for follow-up.",
      "variableExtractionPlan": {
        "output": [
          {
            "type": "string",
            "title": "contact_email",
            "description": "users's email address for nurturing materials"
          },
          {
            "type": "string",
            "title": "follow_up_timeframe",
            "description": "when they'd like to be contacted again"
          }
        ]
      }
    },
    {
      "name": "unqualified_closure",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 1000.7843424930643,
          "y": 2395.0470402241995
        }
      },
      "prompt": "For unqualified leads, say: 'Based on what you've shared, it sounds like our solutions might not be the best fit for your current needs. We typically work best with companies that [mention relevant ideal customer criteria]. To be respectful of your time, I won't suggest moving forward, but if your situation changes, especially regarding [qualifying factor], please reach out.' Be honest but respectful."
    },
    {
      "name": "reschedule_call",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -885.4347033091486,
          "y": 367.29340651463184
        }
      },
      "prompt": "If they're too busy now, say: 'I understand you're pressed for time. Would it be better to schedule a specific time for us to talk? I'd be happy to follow up when timing is better for you.' Get their preferred contact method and timing, then schedule the follow-up.",
      "variableExtractionPlan": {
        "output": [
          {
            "type": "string",
            "title": "callback_time",
            "description": "when they prefer to be called back"
          },
          {
            "type": "string",
            "title": "contact_preference",
            "description": "their preferred contact method"
          }
        ]
      }
    },
    {
      "name": "node_1748494069554",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 855.7693700589409,
          "y": 4.569833689848679
        }
      },
      "prompt": "Confirm that user wants to speak to a human, and ask them what they would like to speak about.",
      "globalNodePlan": {
        "enabled": true,
        "enterCondition": "User wants to speak to a human"
      }
    },
    {
      "name": "Transfer Call",
      "type": "tool",
      "metadata": {
        "position": {
          "x": 855.274797496511,
          "y": 338.4326280229033
        }
      },
      "tool": {
        "type": "transferCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "destinations": []
      }
    },
    {
      "name": "hangup_1748495933394",
      "type": "tool",
      "metadata": {
        "position": {
          "x": -931.1203356839779,
          "y": 2889.877554343056
        }
      },
      "tool": {
        "type": "endCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "messages": [
          {
            "type": "request-start",
            "content": "Thank you for taking the time to chat today. Have a great day!",
            "blocking": true
          }
        ]
      }
    }
  ],
  "edges": [
    {
      "from": "introduction",
      "to": "need_discovery",
      "condition": {
        "type": "ai",
        "prompt": "User agreed to chat and shows interest in learning more"
      }
    },
    {
      "from": "introduction",
      "to": "reschedule_call",
      "condition": {
        "type": "ai",
        "prompt": "User said they're too busy right now but seems potentially interested"
      }
    },
    {
      "from": "introduction",
      "to": "hangup_1748495933394",
      "condition": {
        "type": "ai",
        "prompt": "User was not interested or wants to end the call"
      }
    },
    {
      "from": "need_discovery",
      "to": "solution_alignment",
      "condition": {
        "type": "ai",
        "prompt": "Sufficient information gathered about their business, industry, pain points, and current systems"
      }
    },
    {
      "from": "solution_alignment",
      "to": "qualification_assessment",
      "condition": {
        "type": "ai",
        "prompt": "User showed interest in the solutions presented and wants to learn more"
      }
    },
    {
      "from": "qualification_assessment",
      "to": "qualified_handoff",
      "condition": {
        "type": "ai",
        "prompt": "User met qualification criteria: has timeline within 3-6 months, budget capacity, decision authority or influence, and clear need for our solutions"
      }
    },
    {
      "from": "qualification_assessment",
      "to": "nurture_prospect",
      "condition": {
        "type": "ai",
        "prompt": "User has potential but timing isn't right, budget unclear, or needs more information before moving forward"
      }
    },
    {
      "from": "qualification_assessment",
      "to": "unqualified_closure",
      "condition": {
        "type": "ai",
        "prompt": "User didn't meet ideal customer profile (too small, no budget, no authority, no clear need, or very long timeline)"
      }
    },
    {
      "from": "reschedule_call",
      "to": "hangup_1748495933394",
      "condition": {
        "type": "ai",
        "prompt": "Callback time and contact information obtained, or user decides not to reschedule"
      }
    },
    {
      "from": "qualified_handoff",
      "to": "hangup_1748495933394",
      "condition": {
        "type": "ai",
        "prompt": "Meeting scheduled and contact information obtained"
      }
    },
    {
      "from": "nurture_prospect",
      "to": "hangup_1748495933394",
      "condition": {
        "type": "ai",
        "prompt": "Email obtained and follow-up expectations set"
      }
    },
    {
      "from": "unqualified_closure",
      "to": "hangup_1748495933394",
      "condition": {
        "type": "ai",
        "prompt": "User responded or acknowledged"
      }
    },
    {
      "from": "node_1748494069554",
      "to": "Transfer Call",
      "condition": {
        "type": "ai",
        "prompt": "User confirmed"
      }
    }
  ],
  "globalPrompt": ""
}
```

---

## Template 2: Appointment Scheduler

**Use case:** Inbound calls — schedule, reschedule, or cancel appointments for a health clinic
**Nodes:** 23 (18 conversation + 2 transfer + 3 tool)
**Flow:** Start → New/Reschedule/Cancel/Info → Collect Info → Schedule → Confirm → End
**Notable:** Has parallel paths for routine vs urgent appointments, and a "general info → schedule" path

```json
{
  "name": "Appointment Scheduler",
  "nodes": [
    {
      "name": "start",
      "type": "conversation",
      "isStart": true,
      "metadata": {
        "position": {
          "x": -705.8237557575243,
          "y": -740.9114717829991
        }
      },
      "prompt": "You are Riley, appointment scheduling assistant for Wellness Partners health clinic. Start with: 'Thank you for calling Wellness Partners. This is Riley, your scheduling assistant. How may I help you today?' Listen for scheduling, rescheduling, canceling, or general questions.",
      "messagePlan": {
        "firstMessage": "Thank you for calling Wellness Partners. This is Riley, your scheduling assistant. How may I help you today?"
      }
    },
    {
      "name": "customer_type",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1483.580975329013,
          "y": -23.511909592178966
        }
      },
      "prompt": "Ask: 'Are you a new patient to Wellness Partners, or have you visited us before?' This helps me provide the right assistance for your appointment.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "new",
              "existing"
            ],
            "type": "string",
            "title": "customer_type",
            "description": "Whether the patient is new or existing"
          }
        ]
      }
    },
    {
      "name": "new_appointment",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1471.8258644292039,
          "y": 316.2993071890038
        }
      },
      "prompt": "Ask: 'What type of appointment do you need today?' and 'Do you have a provider preference or want the first available?' Assess urgency level based on their needs.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "Primary Care",
              "Specialist",
              "Diagnostic",
              "Wellness",
              "Urgent Care"
            ],
            "type": "string",
            "title": "appointment_type",
            "description": "Type of appointment needed"
          },
          {
            "enum": [
              "urgent",
              "routine"
            ],
            "type": "string",
            "title": "urgency",
            "description": "Urgency level"
          }
        ]
      }
    },
    {
      "name": "reschedule_cancel",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -388.5315683262705,
          "y": -17.01201596644613
        }
      },
      "prompt": "Ask: 'I'll help you with that. Can you provide your name and date of birth so I can locate your appointment?' Determine if they want to reschedule or cancel.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "patient_name",
            "description": "Patient's full name"
          },
          {
            "enum": [],
            "type": "string",
            "title": "date_of_birth",
            "description": "Patient's date of birth"
          },
          {
            "enum": [
              "reschedule",
              "cancel"
            ],
            "type": "string",
            "title": "action_type",
            "description": "Whether to reschedule or cancel"
          }
        ]
      }
    },
    {
      "name": "general_info",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 722.7050867585804,
          "y": -15.223871902985678
        }
      },
      "prompt": "Provide clinic information. Hours: Monday-Friday 8am-5pm, Saturday 9am-12pm. We accept most insurance plans. For specific coverage questions, contact your insurance directly. Ask if they need anything else or want to schedule an appointment.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "schedule",
              "done"
            ],
            "type": "string",
            "title": "next_action",
            "description": "Whether they want to schedule or are done"
          }
        ]
      }
    },
    {
      "name": "urgent_triage",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -2193.344692421535,
          "y": 708.1282558087164
        }
      },
      "prompt": "Ask: 'Can you briefly describe your symptoms?' If emergency symptoms, direct to 911 or ER. For urgent but not emergency, offer same-day appointment options.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "emergency",
              "urgent_care",
              "same_day"
            ],
            "type": "string",
            "title": "urgency_level",
            "description": "Determined urgency level"
          }
        ]
      }
    },
    {
      "name": "collect_info",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1141.9725905844539,
          "y": 739.5341850995003
        }
      },
      "prompt": "Collect patient details. For new patients: 'I need your full name, date of birth, and phone number.' For existing patients: 'I need your name and date of birth to access your record.'",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "patient_name",
            "description": "Patient's full name"
          },
          {
            "enum": [],
            "type": "string",
            "title": "date_of_birth",
            "description": "Patient's date of birth"
          },
          {
            "enum": [],
            "type": "string",
            "title": "phone_number",
            "description": "Contact phone number"
          }
        ]
      }
    },
    {
      "name": "collect_info_urgent",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1618.942009199001,
          "y": 1126.5941398711234
        }
      },
      "prompt": "Collect patient details for urgent appointment. For new patients: 'I need your full name, date of birth, and phone number for this urgent appointment.' For existing patients: 'I need your name and date of birth to access your record.'",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "patient_name",
            "description": "Patient's full name"
          },
          {
            "enum": [],
            "type": "string",
            "title": "date_of_birth",
            "description": "Patient's date of birth"
          },
          {
            "enum": [],
            "type": "string",
            "title": "phone_number",
            "description": "Contact phone number"
          }
        ]
      }
    },
    {
      "name": "reschedule",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -754.7613039283544,
          "y": 358.46312937002205
        }
      },
      "prompt": "Say: 'I found your appointment on [date] at [time]. Here are new available times: [options].' Confirm their selection and update the appointment.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "new_date",
            "description": "New appointment date"
          },
          {
            "enum": [],
            "type": "string",
            "title": "new_time",
            "description": "New appointment time"
          }
        ]
      }
    },
    {
      "name": "cancel",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 96.73649340762202,
          "y": 396.0532505663149
        }
      },
      "prompt": "Say: 'I found your appointment on [date]. I can cancel this for you. Note: 24-hour notice required to avoid $50 fee.' Confirm cancellation and ask if they want to reschedule instead.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "cancel_only",
              "reschedule_instead"
            ],
            "type": "string",
            "title": "final_action",
            "description": "Final action - cancel only or reschedule instead"
          }
        ]
      }
    },
    {
      "name": "reschedule_from_cancel",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 97.7396338091923,
          "y": 708.6158383641339
        }
      },
      "prompt": "Say: 'I'll reschedule your appointment instead. Here are available times: [options].' Confirm their selection and update the appointment.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "new_date",
            "description": "New appointment date"
          },
          {
            "enum": [],
            "type": "string",
            "title": "new_time",
            "description": "New appointment time"
          }
        ]
      }
    },
    {
      "name": "customer_type_from_info",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 1155.7930375388546,
          "y": 493.33714022246477
        }
      },
      "prompt": "Ask: 'Are you a new patient to Wellness Partners, or have you visited us before?' This helps me provide the right assistance for your appointment.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "new",
              "existing"
            ],
            "type": "string",
            "title": "customer_type",
            "description": "Whether the patient is new or existing"
          }
        ]
      }
    },
    {
      "name": "new_appointment_from_info",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 1277.0746535656376,
          "y": 1017.0948288126076
        }
      },
      "prompt": "Ask: 'What type of appointment do you need today?' and 'Do you have a provider preference or want the first available?' Assess urgency level based on their needs.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "Primary Care",
              "Specialist",
              "Diagnostic",
              "Wellness",
              "Urgent Care"
            ],
            "type": "string",
            "title": "appointment_type",
            "description": "Type of appointment needed"
          },
          {
            "enum": [
              "urgent",
              "routine"
            ],
            "type": "string",
            "title": "urgency",
            "description": "Urgency level"
          }
        ]
      }
    },
    {
      "name": "collect_info_from_info",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 1236.6097216819107,
          "y": 1534.4487114207577
        }
      },
      "prompt": "Collect patient details. For new patients: 'I need your full name, date of birth, and phone number.' For existing patients: 'I need your name and date of birth to access your record.'",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "patient_name",
            "description": "Patient's full name"
          },
          {
            "enum": [],
            "type": "string",
            "title": "date_of_birth",
            "description": "Patient's date of birth"
          },
          {
            "enum": [],
            "type": "string",
            "title": "phone_number",
            "description": "Contact phone number"
          }
        ]
      }
    },
    {
      "name": "emergency_redirect",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -2192.1700111914006,
          "y": 1728.7544435802308
        }
      },
      "prompt": "Say: 'This sounds like a medical emergency. Call 911 or go to your nearest ER immediately. I can provide directions or connect you with our triage nurse if needed.' Be calm but urgent."
    },
    {
      "name": "schedule_time",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1148.0525139142742,
          "y": 1215.7805533900807
        }
      },
      "prompt": "Offer times: 'For {{appointment_type}}, I have [date] at [time] or [date] at [time]. Which works better?' Confirm their selection.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "selected_date",
            "description": "Selected appointment date"
          },
          {
            "enum": [],
            "type": "string",
            "title": "selected_time",
            "description": "Selected appointment time"
          }
        ]
      }
    },
    {
      "name": "schedule_time_urgent",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1616.3897378665279,
          "y": 1514.66031918779
        }
      },
      "prompt": "Offer urgent appointment times: 'For urgent {{appointment_type}}, I have same-day availability at [time] or [time]. Which works for you?' Confirm their selection.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "selected_date",
            "description": "Selected appointment date"
          },
          {
            "enum": [],
            "type": "string",
            "title": "selected_time",
            "description": "Selected appointment time"
          }
        ]
      }
    },
    {
      "name": "schedule_time_from_info",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 1264.9351740005195,
          "y": 2083.209592393373
        }
      },
      "prompt": "Offer times: 'For {{appointment_type}}, I have [date] at [time] or [date] at [time]. Which works better?' Confirm their selection.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "selected_date",
            "description": "Selected appointment date"
          },
          {
            "enum": [],
            "type": "string",
            "title": "selected_time",
            "description": "Selected appointment time"
          }
        ]
      }
    },
    {
      "name": "confirm_appointment",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1147.2083634850887,
          "y": 1520.2095032887985
        }
      },
      "prompt": "Confirm: 'You're scheduled for {{appointment_type}} on {{selected_date}} at {{selected_time}}.' Give arrival instructions based on {{customer_type}}: New patients arrive 20 min early, existing patients 15 min early. Bring insurance card and ID. Ask about reminder preferences.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "yes",
              "no"
            ],
            "type": "string",
            "title": "wants_reminder",
            "description": "Wants appointment reminder"
          }
        ]
      }
    },
    {
      "name": "confirm_appointment_urgent",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1613.5324085869356,
          "y": 1943.4071866751312
        }
      },
      "prompt": "Confirm: 'You're scheduled for urgent {{appointment_type}} on {{selected_date}} at {{selected_time}}.' Give arrival instructions based on {{customer_type}}: New patients arrive 20 min early, existing patients 15 min early. Bring insurance card and ID.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "yes",
              "no"
            ],
            "type": "string",
            "title": "wants_reminder",
            "description": "Wants appointment reminder"
          }
        ]
      }
    },
    {
      "name": "confirm_appointment_from_info",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 1280.4936711110045,
          "y": 2486.037813494239
        }
      },
      "prompt": "Confirm: 'You're scheduled for {{appointment_type}} on {{selected_date}} at {{selected_time}}.' Give arrival instructions based on {{customer_type}}: New patients arrive 20 min early, existing patients 15 min early. Bring insurance card and ID. Ask about reminder preferences.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "yes",
              "no"
            ],
            "type": "string",
            "title": "wants_reminder",
            "description": "Wants appointment reminder"
          }
        ]
      }
    },
    {
      "name": "node_1748494934592",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 2004.5298396262576,
          "y": -711.2034330358723
        }
      },
      "prompt": "Confirm that the user wants to speak to a human and ask them what they would like to speak to the human about",
      "globalNodePlan": {
        "enabled": true,
        "enterCondition": "User wants to speak to a human"
      }
    },
    {
      "name": "Transfer Call",
      "type": "tool",
      "metadata": {
        "position": {
          "x": 2005.350541948589,
          "y": -263.56014446373115
        }
      },
      "tool": {
        "type": "transferCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "destinations": []
      }
    },
    {
      "name": "hangup_1748495964695",
      "type": "tool",
      "metadata": {
        "position": {
          "x": -354.92881830948005,
          "y": 2822.1302851891933
        }
      },
      "tool": {
        "type": "endCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "messages": [
          {
            "type": "request-start",
            "content": "Thank you for calling Wellness Partners. Have a wonderful day!",
            "blocking": true
          }
        ]
      }
    }
  ],
  "edges": [
    {
      "from": "start",
      "to": "customer_type",
      "condition": {
        "type": "ai",
        "prompt": "User wanted to schedule a new appointment"
      }
    },
    {
      "from": "start",
      "to": "reschedule_cancel",
      "condition": {
        "type": "ai",
        "prompt": "User wanted to reschedule or cancel an appointment"
      }
    },
    {
      "from": "start",
      "to": "general_info",
      "condition": {
        "type": "ai",
        "prompt": "User had questions about clinic info, hours, or services"
      }
    },
    {
      "from": "customer_type",
      "to": "new_appointment",
      "condition": {
        "type": "ai",
        "prompt": "User type determined, ready to proceed with appointment scheduling"
      }
    },
    {
      "from": "new_appointment",
      "to": "urgent_triage",
      "condition": {
        "type": "ai",
        "prompt": "User indicated urgent care need"
      }
    },
    {
      "from": "new_appointment",
      "to": "collect_info",
      "condition": {
        "type": "ai",
        "prompt": "User neede routine appointment"
      }
    },
    {
      "from": "reschedule_cancel",
      "to": "reschedule",
      "condition": {
        "type": "ai",
        "prompt": "User wated to reschedule appointment"
      }
    },
    {
      "from": "reschedule_cancel",
      "to": "cancel",
      "condition": {
        "type": "ai",
        "prompt": "User wanted to cancel appointment"
      }
    },
    {
      "from": "general_info",
      "to": "customer_type_from_info",
      "condition": {
        "type": "ai",
        "prompt": "User wanted to schedule after getting info"
      }
    },
    {
      "from": "general_info",
      "to": "hangup_1748495964695",
      "condition": {
        "type": "ai",
        "prompt": "User's questions answered, no further help needed"
      }
    },
    {
      "from": "urgent_triage",
      "to": "emergency_redirect",
      "condition": {
        "type": "ai",
        "prompt": "Symptoms indicate medical emergency"
      }
    },
    {
      "from": "urgent_triage",
      "to": "collect_info_urgent",
      "condition": {
        "type": "ai",
        "prompt": "Urgent but not emergency, can schedule same-day"
      }
    },
    {
      "from": "collect_info",
      "to": "schedule_time",
      "condition": {
        "type": "ai",
        "prompt": "Patient information collected successfully"
      }
    },
    {
      "from": "collect_info_urgent",
      "to": "schedule_time_urgent",
      "condition": {
        "type": "ai",
        "prompt": "Urgent patient information collected successfully"
      }
    },
    {
      "from": "reschedule",
      "to": "hangup_1748495964695",
      "condition": {
        "type": "ai",
        "prompt": "Appointment successfully rescheduled"
      }
    },
    {
      "from": "cancel",
      "to": "reschedule_from_cancel",
      "condition": {
        "type": "ai",
        "prompt": "Patient wants to reschedule instead of cancel"
      }
    },
    {
      "from": "cancel",
      "to": "hangup_1748495964695",
      "condition": {
        "type": "ai",
        "prompt": "Appointment canceled, no reschedule needed"
      }
    },
    {
      "from": "reschedule_from_cancel",
      "to": "hangup_1748495964695",
      "condition": {
        "type": "ai",
        "prompt": "Appointment rescheduled from cancellation"
      }
    },
    {
      "from": "customer_type_from_info",
      "to": "new_appointment_from_info",
      "condition": {
        "type": "ai",
        "prompt": "Customer type determined after general info"
      }
    },
    {
      "from": "new_appointment_from_info",
      "to": "collect_info_from_info",
      "condition": {
        "type": "ai",
        "prompt": "Appointment type determined after general info"
      }
    },
    {
      "from": "emergency_redirect",
      "to": "hangup_1748495964695",
      "condition": {
        "type": "ai",
        "prompt": "Emergency guidance provided"
      }
    },
    {
      "from": "schedule_time",
      "to": "confirm_appointment",
      "condition": {
        "type": "ai",
        "prompt": "Patient selected appointment time"
      }
    },
    {
      "from": "schedule_time_urgent",
      "to": "confirm_appointment_urgent",
      "condition": {
        "type": "ai",
        "prompt": "Patient selected urgent appointment time"
      }
    },
    {
      "from": "collect_info_from_info",
      "to": "schedule_time_from_info",
      "condition": {
        "type": "ai",
        "prompt": "Patient information collected after general info"
      }
    },
    {
      "from": "schedule_time_from_info",
      "to": "confirm_appointment_from_info",
      "condition": {
        "type": "ai",
        "prompt": "Patient selected appointment time after general info"
      }
    },
    {
      "from": "confirm_appointment",
      "to": "hangup_1748495964695",
      "condition": {
        "type": "ai",
        "prompt": "Appointment confirmed and instructions given"
      }
    },
    {
      "from": "confirm_appointment_urgent",
      "to": "hangup_1748495964695",
      "condition": {
        "type": "ai",
        "prompt": "Urgent appointment confirmed and instructions given"
      }
    },
    {
      "from": "confirm_appointment_from_info",
      "to": "hangup_1748495964695",
      "condition": {
        "type": "ai",
        "prompt": "Appointment confirmed after general info flow"
      }
    },
    {
      "from": "node_1748494934592",
      "to": "Transfer Call",
      "condition": {
        "type": "ai",
        "prompt": "User confirms they want to speak to a human and describes what they want to speak about"
      }
    }
  ],
  "globalPrompt": ""
}
```

---

## Template 3: Customer Satisfaction Survey

**Use case:** Outbound survey calls — collect feedback, NPS scores, improvement suggestions
**Nodes:** 18 (13 conversation + 1 transfer + 4 tool)
**Flow:** Intro → Context → Engagement → Satisfaction → NPS → Improvements → Demographics → Final → End
**Notable:** Multiple end-call nodes with different goodbye messages, branching based on satisfaction level

```json
{
  "name": "Customer Satisfaction Survey",
  "nodes": [
    {
      "name": "start_introduction",
      "type": "conversation",
      "isStart": true,
      "metadata": {
        "position": {
          "x": 1536.789449549366,
          "y": -950.6126742658206
        }
      },
      "prompt": "You are Cameron, a feedback collection voice assistant for QualityMetrics Research. Start with: 'We're conducting a brief survey about customer satisfaction. This will take approximately 5 to 7 minutes and help improve products and services. Would you be willing to participate today?'",
      "messagePlan": {
        "firstMessage": "Hello, this is Cameron calling on behalf of QualityMetrics Research."
      }
    },
    {
      "name": "context_setting",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -311.1651062767652,
          "y": -159.63360846592298
        }
      },
      "prompt": "Explain the survey purpose: 'The purpose of this survey is to understand your experience with our products so that we can make it better for customers like you. I'll ask you a few questions. Most will take just a few seconds to answer. Your responses will be kept confidential and reported only in combination with other participants' feedback.'\n\nAsk if the user understands and is ready to proceed with the main survey or is interested in a shorter version of it "
    },
    {
      "name": "reschedule_offer",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 1537.0503083163985,
          "y": -210.95843072916665
        }
      },
      "prompt": "Respond to hesitation: 'I understand your time is valuable. The survey is designed to be brief, and your feedback will directly influence improvements to products and services you use. Would it be better if I called at another time, or would you prefer to receive this survey via email instead?'"
    },
    {
      "name": "engagement_questions",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1036.8339902511216,
          "y": 398.25905189828825
        }
      },
      "prompt": "Start with engagement questions to build momentum. Ask: 'First, have you used any of our products or services in the past 3 months?' Wait for response, then ask: 'How often do you typically interact with our company - would you say weekly, monthly, or less frequently?'",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "recent_usage",
            "description": "whether user has used products/services in past 3 months"
          },
          {
            "enum": [],
            "type": "string",
            "title": "usage_frequency",
            "description": "how often user interacts with the company"
          }
        ]
      }
    },
    {
      "name": "core_satisfaction",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 417.90409470272056,
          "y": 391.1710825344917
        }
      },
      "prompt": "Ask core satisfaction questions. Say: 'I'd like to ask about your overall experience. On a scale of 1 to 5, where 1 is very dissatisfied and 5 is very satisfied, how would you rate your overall experience with our company?' Wait for response, then ask: 'Thinking about your most recent interaction with us, what went particularly well?'",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "number",
            "title": "satisfaction_rating",
            "description": "overall satisfaction rating from 1-5"
          },
          {
            "enum": [],
            "type": "string",
            "title": "positive_experience",
            "description": "what went well in recent interaction"
          }
        ]
      }
    },
    {
      "name": "satisfaction_followup",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -1613.7726355031182,
          "y": 1069.4997879853927
        }
      },
      "prompt": "Say: 'That's great to hear! What specific aspects of our service do you value most?'"
    },
    {
      "name": "nps_question",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -19.523287992371678,
          "y": 1031.6522848172492
        }
      },
      "prompt": "Ask NPS question: 'On a scale of 0-10, where 0 is not at all likely and 10 is extremely likely, how likely are you to recommend our company to a friend or colleague?' Wait for response, then ask: 'What is the primary reason for your rating?'",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "number",
            "title": "nps_score",
            "description": "Net Promoter Score from 0-10"
          },
          {
            "enum": [],
            "type": "string",
            "title": "nps_reason",
            "description": "reason for the NPS rating given"
          }
        ]
      }
    },
    {
      "name": "improvement_areas",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -595.7269251723233,
          "y": 1058.678308619724
        }
      },
      "prompt": "Ask about improvements: 'What aspects of our products or services could be improved to better meet your needs?' Allow silence for thinking, then if needed: 'Could you share a specific example of when you felt we could have done better?'",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "improvement_suggestions",
            "description": "areas for improvement mentioned by user"
          }
        ]
      }
    },
    {
      "name": "competitive_comparison",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 864.4798487130331,
          "y": 1040.1692332710993
        }
      },
      "prompt": "Ask comparison question: 'Compared to other similar companies you've worked with, would you say our service is better, worse, or about the same?' Then ask: 'What makes the biggest difference in your experience with companies like ours?'",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "competitive_rating",
            "description": "how company compares to competitors"
          },
          {
            "enum": [],
            "type": "string",
            "title": "key_differentiators",
            "description": "what makes biggest difference in customer experience"
          }
        ]
      }
    },
    {
      "name": "demographic_intro",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -320.82721330388466,
          "y": 1655.4590781492213
        }
      },
      "prompt": "Introduce demographic questions: 'Just a few final classification questions to help us analyze the results and ensure we're representing all types of customers. If you're comfortable sharing, which of the following age ranges do you fall into: 18 to 24, 25 to 40, 41 to 55, or 55 and over?'",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "age_range",
            "description": "age range category of respondent"
          }
        ]
      }
    },
    {
      "name": "final_thoughts",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -844.979338922804,
          "y": 2159.3486005605646
        }
      },
      "prompt": "Ask for final thoughts: 'Those are all the questions I have. Is there anything else about your experience with our company that you'd like to share that we haven't covered?' Allow time for response.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "additional_feedback",
            "description": "any additional feedback or comments"
          }
        ]
      }
    },
    {
      "name": "customer_type",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 153.19478875491984,
          "y": 2171.6636295895214
        }
      },
      "prompt": "Ask: 'Are you a new patient to Wellness Partners, or have you visited us before?' This helps me provide the right assistance for your appointment.",
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [
              "new",
              "existing"
            ],
            "type": "string",
            "title": "customer_type",
            "description": "Whether the patient is new or existing"
          }
        ]
      }
    },
    {
      "name": "node_1748495176744",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": 3534.1379658502237,
          "y": -948.7776870351952
        }
      },
      "prompt": "Confirm that the user wants to speak to a human and ask them what they would like to speak to a human about.",
      "globalNodePlan": {
        "enabled": true,
        "enterCondition": "User wants to speak to a human"
      }
    },
    {
      "name": "Transfer Call",
      "type": "tool",
      "metadata": {
        "position": {
          "x": 3529.607467974884,
          "y": -433.1950447045268
        }
      },
      "tool": {
        "type": "transferCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "destinations": []
      }
    },
    {
      "name": "hangup_1748495840705",
      "type": "tool",
      "metadata": {
        "position": {
          "x": 1218.718436166098,
          "y": 242.84519437504542
        }
      },
      "tool": {
        "type": "endCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "messages": [
          {
            "type": "request-start",
            "content": "Perfect! I'll make sure to reach out at a more convenient time. Thank you and have a great day!",
            "blocking": true
          }
        ]
      }
    },
    {
      "name": "hangup_1748495855580",
      "type": "tool",
      "metadata": {
        "position": {
          "x": 1863.0804658032348,
          "y": 241.08539375893156
        }
      },
      "tool": {
        "type": "endCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "messages": [
          {
            "type": "request-start",
            "content": "That's a great option! You'll receive the survey via email within the next 24 hours. Thank you for your willingness to participate!",
            "blocking": true
          }
        ]
      }
    },
    {
      "name": "hangup_1748495870983",
      "type": "tool",
      "metadata": {
        "position": {
          "x": 2699.4114918044247,
          "y": -153.96167287549952
        }
      },
      "tool": {
        "type": "endCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "messages": [
          {
            "type": "request-start",
            "content": "I completely understand. Thank you for your time and have a wonderful day!",
            "blocking": true
          }
        ]
      }
    },
    {
      "name": "hangup_1748735165807",
      "type": "tool",
      "metadata": {
        "position": {
          "x": -345.85448557978043,
          "y": 2699.113643146562
        }
      },
      "tool": {
        "type": "endCall",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
        },
        "messages": [
          {
            "type": "request-start",
            "content": "Thank you very much for taking the time to share your feedback today. Your insights are extremely valuable and will help us improve our products and services. Have a wonderful day!",
            "blocking": true
          }
        ]
      }
    }
  ],
  "edges": [
    {
      "from": "start_introduction",
      "to": "context_setting",
      "condition": {
        "type": "ai",
        "prompt": "User agreed to participate in the survey"
      }
    },
    {
      "from": "start_introduction",
      "to": "reschedule_offer",
      "condition": {
        "type": "ai",
        "prompt": "User expressed hesitation or concern about timing"
      }
    },
    {
      "from": "start_introduction",
      "to": "hangup_1748495870983",
      "condition": {
        "type": "ai",
        "prompt": "User clearly declined to participate"
      }
    },
    {
      "from": "context_setting",
      "to": "engagement_questions",
      "condition": {
        "type": "ai",
        "prompt": "User understood the survey context and is ready to proceed with the main survey"
      }
    },
    {
      "from": "context_setting",
      "to": "core_satisfaction",
      "condition": {
        "type": "ai",
        "prompt": "User wanted to proceed with the shorter version of the survey"
      }
    },
    {
      "from": "reschedule_offer",
      "to": "hangup_1748495840705",
      "condition": {
        "type": "ai",
        "prompt": "User preferred to be called at another time"
      }
    },
    {
      "from": "reschedule_offer",
      "to": "hangup_1748495855580",
      "condition": {
        "type": "ai",
        "prompt": "User preferred to receive survey via email"
      }
    },
    {
      "from": "engagement_questions",
      "to": "satisfaction_followup",
      "condition": {
        "type": "ai",
        "prompt": "User indicated recent usage and engagement with the company"
      }
    },
    {
      "from": "engagement_questions",
      "to": "improvement_areas",
      "condition": {
        "type": "ai",
        "prompt": "User indicated limited or infrequent usage"
      }
    },
    {
      "from": "core_satisfaction",
      "to": "nps_question",
      "condition": {
        "type": "ai",
        "prompt": "User provided satisfaction rating and positive experience details"
      }
    },
    {
      "from": "core_satisfaction",
      "to": "competitive_comparison",
      "condition": {
        "type": "ai",
        "prompt": "User provided mixed or concerning feedback about their experience"
      }
    },
    {
      "from": "satisfaction_followup",
      "to": "demographic_intro",
      "condition": {
        "type": "ai",
        "prompt": "User described the services they value the most"
      }
    },
    {
      "from": "nps_question",
      "to": "demographic_intro",
      "condition": {
        "type": "ai",
        "prompt": "User provided NPS score and reasoning"
      }
    },
    {
      "from": "improvement_areas",
      "to": "demographic_intro",
      "condition": {
        "type": "ai",
        "prompt": "User shared improvement suggestions or examples"
      }
    },
    {
      "from": "competitive_comparison",
      "to": "demographic_intro",
      "condition": {
        "type": "ai",
        "prompt": "User provided comparison feedback and key differentiators"
      }
    },
    {
      "from": "demographic_intro",
      "to": "final_thoughts",
      "condition": {
        "type": "ai",
        "prompt": "User provided age range information"
      }
    },
    {
      "from": "demographic_intro",
      "to": "customer_type",
      "condition": {
        "type": "ai",
        "prompt": "User preferred not to share age"
      }
    },
    {
      "from": "final_thoughts",
      "to": "hangup_1748735165807",
      "condition": {
        "type": "ai",
        "prompt": "User shared final thoughts or indicates they have nothing more to add"
      }
    },
    {
      "from": "customer_type",
      "to": "hangup_1748735165807",
      "condition": {
        "type": "ai",
        "prompt": "User provided customer relationship information"
      }
    },
    {
      "from": "node_1748495176744",
      "to": "Transfer Call",
      "condition": {
        "type": "ai",
        "prompt": "User confirmed they want to speak to a human and describe what they want to talk to them about"
      }
    }
  ],
  "globalPrompt": ""
}
```

---

## Lessons for Building Our Farm Bureau Workflow

### What Works in These Templates:
1. **Each node has ONE job** — collect info, ask questions, confirm, etc.
2. **Variable extraction** captures data at each step so later nodes can reference it
3. **Global nodes** handle "I want a human" from anywhere in the flow
4. **endCall tool nodes** have custom goodbye messages with `blocking: true`
5. **Multiple paths** handle different caller intents from the start node

### What to Watch Out For:
1. **AI-evaluated conditions can be unreliable** — we experienced this firsthand with our earlier workflow attempts
2. **Too many nodes = more failure points** — the appointment scheduler has 23 nodes, which is complex
3. **Duplicate nodes** — the appointment scheduler duplicates entire paths (collect_info, collect_info_urgent, collect_info_from_info) instead of reusing nodes. This is a Vapi limitation.

### Our Farm Bureau Workflow Plan (When Ready):
- **Start node:** Greeting + listen for intent
- **Edges from start:** Ask for person → person_handler | Give reason → collect_info | Relay message → relay_handler | General question → general_handler
- **collect_info node:** Get name (with variable extraction for caller_name)
- **email node:** Ask for optional email
- **confirm_reason node:** Confirm or ask for reason
- **wrap_up node:** Anything else? → endCall tool
- **Global node:** "Want to speak to a human" → provide direct number
- Keep it to **5-7 nodes max**
- Use **variable extraction** to trigger transitions instead of pure AI evaluation where possible
