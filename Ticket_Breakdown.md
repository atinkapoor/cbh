# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here
======================

## Ticket 1: Create table for relation between Agent internal id and Facility custom id

**Requirement:** Have a database table/schema to save relation between Agent internal id and Facility csutom id, which can be later used in Reporting

**Implementation Details:**
- Create new table as `FacilityAgents`
- It will have following fields: `id`, `agentId`, `facilityId`, `facilityCustomId`
- `id` is the auto-increment id
- `facilityCustomId` is the Custom Id each Facility will have for each Agent
- This table will provide the capabilities to each Facility to store Custom Id for each Agent
- We can create indexes on `agentId`, `facilityId`, so that we can fetch `facilityCustomId` using `agentId` and `facilityId`
- This ticket only covers creating the table structure, how and where to use this table will be covered in further tickets

**Assumptions:**
- `agentId` is the auto-increment id of `Agents` table
- `facilityId` is the auto-increment id of `Facilities` table

**Acceptance Criterias:**
- Database should have a new table created as `FacilityAgents`
- `FacilityAgents` table should have following fields: `id`, `agentId`, `facilityId`, `facilityCustomId`
- `FacilityAgents` table should have necessary indexes

**Time/Effort Estimate:** 0.5 days


## Ticket 2: Add Facility custom id when booking Agent to a Shift for a Facility

**Requirement:** Have an option for Facility to provide custom id for the Agent  while booking

**Implementation Details:**
- The process/code for booking an Agent for a Facility at a Shift will need to be modified/updated
- We will need to save Facility custom id in the new table `FacilityAgents`
- If there is already a custom id for an Agent for a particular Faciliy, we don't need to save or update it
- Create / update unit and integration tests

**Assumptions:**
- Facility will provide details of custom id for Agent while booking, either during request or response to the booking
- Custom id of the Agent for a Facility will not be updated, so if a Faciliy provide a different custom id for the same Agent, it will not be updated

**Open/Discussion point:**
- Rather than creating relation between Agent and Facility during booking, we could also add custom ids of all agents for all facilities as an initial step. The main disadvantages for this approach will be:
    - We need to get custom ids for all Agents from all Facilities, and it is very much possible that not every Facility will need every Agent
    - We will have to then create a process that whenever a new Agent is added, we have to get his custom id from all Facilities.
- Another option/approach is to have Faciliy manage custom id for each Agent they work with, if they already have an interface / option to do that

**Acceptance Criterias:**
- Custom id of Agent for a Faciltiy is saved in new table `FacilityAgents`, when a new booking is made
- No additional row will be created when multiple bookings are made for an Agent for the same Fcility
- If a different custom id for an Agent is provided by the Facility, it will not be updated and the first one will be used.
- Proper code coverage as part of unit and integration tests

**Time/Effort Estimate:** 2-3 days


## Ticket 3: Include Facility custom id as part of `getShiftsByFacility` function

**Requirement:** Facility custom id is included as part of report generation step

**Implementation Details:**
- `getShiftsByFacility` need to be updated to fetch Agent custom id (from field `facilityCustomId`) from `FacilityAgents` table and include it as part of metadata
- If for any reason there is no custom id for an Agent for a Facility, it will be empty, but the code should work in both the cases
- Agent internal id should still remain as part of the metadata
- Create / update unit and integration tests

**Acceptance Criterias:**
- Output of `getShiftsByFacility` should have Facility custom id for the Agent in metadata
- If there is no Facility custom id for an Agent, then this field will be blank but the internal id should always be present
- Proper code coverage as part of unit and integration tests

**Time/Effort Estimate:** 1-2 days


## Ticket 4: Include Facility custom id as part of `generateReport` function

**Requirement:** Facility custom id is included as part of report generation

**Implementation Details:**
- `generateReport` need to be updated to consider new field of Facility custom id as part of `getShiftsByFacility` function
- If for any reason there is no custom id for an Agent for a Facility, it will be empty, but the code should work in both the cases
- Create / update unit and integration tests

**Acceptance Criterias:**
- The generated PDF from `generateReport` should have Facility custom id for the Agent
- If there is no Facility custom id for an Agent, then this field will be blank but the internal id should always be present
- Proper code coverage as part of unit and integration tests

**Time/Effort Estimate:** 1-2 days
