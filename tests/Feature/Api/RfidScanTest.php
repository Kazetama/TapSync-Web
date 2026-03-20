<?php

namespace Tests\Feature\Api;

use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class RfidScanTest extends TestCase
{
    /**
     * Test the RFID scan endpoint.
     */
    public function test_device_can_scan_rfid_card(): void
    {
        $rfidUid = 'ABC123XYZ';

        $response = $this->postJson('/api/rfid/scan', [
            'rfid_uid' => $rfidUid,
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'rfid_uid' => $rfidUid,
                 ]);

        // Verify it was stored in cache
        $this->assertEquals($rfidUid, Cache::get('last_rfid_tap'));
    }

    /**
     * Test polling for the latest scan.
     */
    public function test_frontend_can_poll_latest_scan(): void
    {
        $rfidUid = 'XYZ789ABC';
        
        // Setup cache manually
        Cache::put('last_rfid_tap', $rfidUid, 60);

        $response = $this->getJson('/api/rfid/latest');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'rfid_uid' => $rfidUid,
                 ]);

        // Verify cache was cleared after retrieval
        $this->assertNull(Cache::get('last_rfid_tap'));
    }

    /**
     * Test polling when no scan exists.
     */
    public function test_frontend_receives_404_when_no_recent_scan(): void
    {
        Cache::forget('last_rfid_tap');

        $response = $this->getJson('/api/rfid/latest');

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                 ]);
    }

    /**
     * Test device status and heartbeat.
     */
    public function test_device_status_and_heartbeat(): void
    {
        // 1. Initial status should be offline if never seen
        Cache::forget('rfid_device_last_seen');
        $response = $this->getJson('/api/rfid/status');
        $response->assertJson(['is_online' => false]);

        // 2. Send heartbeat
        $this->postJson('/api/rfid/heartbeat')
             ->assertStatus(200);

        // 3. Status should now be online
        $response = $this->getJson('/api/rfid/status');
        $response->assertJson(['is_online' => true]);

        // 4. Test scan also updates status
        Cache::forget('rfid_device_last_seen');
        $this->postJson('/api/rfid/scan', ['rfid_uid' => 'CARD123']);
        
        $response = $this->getJson('/api/rfid/status');
        $response->assertJson(['is_online' => true]);
    }

    /**
     * Test that Attendance scan also updates the RFID scan cache.
     */
    public function test_attendance_scan_updates_rfid_scan_cache(): void
    {
        $rfidUid = 'ATTENDANCE-TAP-123';
        Cache::forget('last_rfid_tap');

        // Simulate attendance scan (even if card not registered)
        $this->postJson('/api/attendance/scan', [
            'uid' => $rfidUid,
        ]);

        // Verify it was stored in the scan cache
        $this->assertEquals($rfidUid, Cache::get('last_rfid_tap'));

        // Verify the polling API returns it
        $response = $this->getJson('/api/rfid/latest');
        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'rfid_uid' => $rfidUid,
                 ]);
    }
}
