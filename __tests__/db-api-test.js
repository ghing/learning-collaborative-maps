"use strict";

var dbApi = require("../db-api");

describe('db-api', () => {
  describe('updateAgency', () => {
    it('calls the mongodb updateOne() method', () => {
      const agency = {
        agency: "Apna Ghar",
        slug: "apna-ghar",
        catchment_area: "Chicago",
        program_type: "Prevention + Intervention",
        office_location: "4350 N. Broadway Chicago",
        lng: -87.65485,
        lat: 41.961304,
        marker_color: "#DBA901"
      };

      const updateOne = jest.fn();
      const db = {
        collection: () => {
          return {
            updateOne: updateOne 
          }; 
        }
      };

      const callback = jest.fn();

      dbApi.updateAgency(agency, db, callback);
      expect(updateOne.mock.calls.length).toEqual(1);
      expect(updateOne.mock.calls[0][1]['$set'].slug).toEqual(agency.slug);
    });
  });
});
