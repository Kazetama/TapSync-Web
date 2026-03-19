<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class RfidScanController extends Controller
{
    /**
     * Endpoint for physical RFID device to send UID when card is tapped.
     */
    public function scan(Request $request): JsonResponse
    {
        $request->validate([
            'rfid_uid' => ['required', 'string', 'min:4', 'max:50'],
        ]);

        $uid = strtoupper($request->rfid_uid);

        // Store the UID in cache for 60 seconds
        Cache::put('last_rfid_tap', $uid, 60);

        return response()->json([
            'success' => true,
            'message' => 'RFID Tap recorded successfully.',
            'rfid_uid' => $uid,
        ]);
    }

    /**
     * Endpoint for frontend to poll for the latest UID tapped.
     */
    public function latest(): JsonResponse
    {
        $uid = Cache::get('last_rfid_tap');

        if (!$uid) {
            return response()->json([
                'success' => false,
                'message' => 'No recent RFID tap found.',
            ], 404);
        }

        // Optional: Clear cache after retrieval to prevent same tap being read twice
        // If the user wants to tap once and populate once.
        Cache::forget('last_rfid_tap');

        return response()->json([
            'success' => true,
            'rfid_uid' => $uid,
        ]);
    }
}
