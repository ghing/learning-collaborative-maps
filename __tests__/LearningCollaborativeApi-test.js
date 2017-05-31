jest.mock('isomorphic-fetch');

import LearningCollaborativeApi from '../js/src/utils/LearningCollaborativeApi';

describe('LearningCollaborativeApi', () => {

  describe('createAgency', () => {
    it('sends a request to the REST API', () => {
      // Mock `fetch()`. In real life this is from the `isomorphic-fetch`
      // package
      const mockPromise = new Promise((resolve, reject) => {
        resolve([{}]);
      });
      window.fetch = jest.fn()
        .mockReturnValue(mockPromise);

      const agency = {
        agency: "Apna Ghar",
        slug: "apna-ghar",
        catchment_area: "Chicago",
        program_type: "Prevention + Intervention",
        office_location: "4350 N. Broadway Chicago",
        lng: -87.65485,
        lat: 41.961304,
        marker_color: "#DBA901",
      };

      LearningCollaborativeApi.createAgency(
        agency.slug,
        agency.agency,
        agency.catchment_area,
        agency.program_type,
        agency.office_location,
        agency.lat,
        agency.lng,
        agency.marker_color
      );

      expect(window.fetch.mock.calls.length).toEqual(1);

      const numCalls = window.fetch.mock.calls.length;
      const lastCall = window.fetch.mock.calls[numCalls - 1];
      const fetchUrl = lastCall[0];
      const fetchOpts = lastCall[1];
      const payload = JSON.parse(fetchOpts.body);

      expect(fetchUrl).toEqual('/api/1/agencies');
      expect(fetchOpts.method).toEqual('post');
      expect(payload.slug).toEqual(agency.slug);
      expect(payload.agency).toEqual(agency.agency);
      expect(payload.catchment_area).toEqual(agency.catchment_area);
      expect(payload.program_type).toEqual(agency.program_type);
      expect(payload.office_location).toEqual(agency.office_location);
      expect(payload.lat).toEqual(agency.lat);
      expect(payload.lng).toEqual(agency.lng);
      expect(payload.marker_color).toEqual(agency.marker_color);
    });
  });

  describe('updateAgency', () => {
    it('sends a request to the REST API', () => {
      // Mock `fetch()`. In real life this is from the `isomorphic-fetch`
      // package
      const mockPromise = new Promise((resolve, reject) => {
        resolve({});
      });
      window.fetch = jest.fn()
        .mockReturnValue(mockPromise);

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

      LearningCollaborativeApi.updateAgency(
        agency.slug,
        agency.agency,
        agency.catchment_area,
        agency.program_type,
        agency.office_location,
        agency.lat,
        agency.lng,
        agency.marker_color
      );

      expect(window.fetch.mock.calls.length).toEqual(1);

      const numCalls = window.fetch.mock.calls.length;
      const lastCall = window.fetch.mock.calls[numCalls - 1];
      const fetchUrl = lastCall[0];
      const fetchOpts = lastCall[1];
      const payload = JSON.parse(fetchOpts.body);

      expect(fetchUrl).toEqual(`/api/1/agencies/${agency.slug}`);
      expect(fetchOpts.method).toEqual('put');
      expect(payload.slug).toEqual(agency.slug);
      expect(payload.agency).toEqual(agency.agency);
      expect(payload.catchment_area).toEqual(agency.catchment_area);
      expect(payload.program_type).toEqual(agency.program_type);
      expect(payload.office_location).toEqual(agency.office_location);
      expect(payload.lat).toEqual(agency.lat);
      expect(payload.lng).toEqual(agency.lng);
      expect(payload.marker_color).toEqual(agency.marker_color);
    });
  });
});
