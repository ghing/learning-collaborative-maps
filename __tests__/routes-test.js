"use strict";

jest.unmock('../routes');

describe('routes', () => {
  const routes = require('../routes');

  describe('setProgramId', () => {
    it('sets a programId property on the request object', () => {
      let req = {};
      let res = {};
      const next = jest.fn();
      const programId = '0036b2142e1e446f9e31aace2f33500e';

      routes.setProgramId(req, res, next, programId);
      expect(next.calls.length).toEqual(1);
      expect(req.programId).toEqual(programId);
    });
  });

  describe('createProgramNote', () => {
    it('response with a created note object', () => {
      let req = {
        school: {
          Address: "16100 W 127th St",
          City: "Lemont",
          FacilityName: "Old Quarry Middle Sch",
          GradeServed: "6-8",
          Zip: "60439 7462",
          _id: "5705cc90129aad323ae41863",
          programs: [
            {
              agency: "/api/1/agencies/apna-ghar",
              age_group: "9-12",
              program_type: "Dating/Partner Violence/Bullying",
              _id: "571bf3f9b5c0fe3f3502f9c0"
            }
          ],
          rcdts: "07016113A021002",
        },
        programId: '0036b2142e1e446f9e31aace2f33500e',
        body: {
          text: "Test note text"
        }
      };

      let res = {
        status: jest.fn(),
        json: jest.fn()
      };

      // TODO: Probably need to mock db-api here

      routes.createProgramNote(req, res);
      expect(res.status.calls[0][0]).toEqual(201);
      expect(res.json.calls[0][0].text).toEqual(req.text);
    });
  });
});
