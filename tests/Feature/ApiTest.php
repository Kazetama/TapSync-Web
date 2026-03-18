<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test the simple API user route.
     */
    public function test_api_user_route_returns_success_and_json(): void
    {
        $response = $this->getJson('/api/test');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Bisa Cuy Yakali Gak Bisa!',
                 ]);
    }
}
